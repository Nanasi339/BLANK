class OceanRenderer {
    constructor(canvas, storage) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.storage = storage;
        this.width = 0;
        this.height = 0;
        this.time = 0;
        this.items = []; // Falling/Sinking items
        this.bubbles = []; // Rising bubbles

        // Color State
        this.baseColors = { start: [2, 0, 36], end: [0, 212, 255] }; // RGB arrays
        this.currentColors = { start: [...this.baseColors.start], end: [...this.baseColors.end] };

        // Debug
        console.log('OceanRenderer initialized');
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    reset() {
        this.items = [];
        this.bubbles = [];
        this.currentColors = { start: [...this.baseColors.start], end: [...this.baseColors.end] };
    }

    draw() {
        this.time += 0.005;
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background Gradient (Dynamic)
        const c1 = `rgb(${this.currentColors.start.join(',')})`;
        const c2 = `rgb(${this.currentColors.end.join(',')})`;

        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, c1);
        gradient.addColorStop(1, c2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.updateEnvironment(); // Check for bubbles and color updates
        this.drawBubbles();
        this.drawItems(); // Draw falling items behind/in waves logic (actually depends on z-index effect)

        // Wave Configuration
        const waves = [
            { y: this.height * 0.5, amp: 20, freq: 0.01, speed: 0.02, color: 'rgba(0, 100, 200, 0.4)' },
            { y: this.height * 0.55, amp: 25, freq: 0.008, speed: 0.025, color: 'rgba(0, 120, 220, 0.4)' },
            { y: this.height * 0.6, amp: 30, freq: 0.006, speed: 0.03, color: 'rgba(0, 150, 255, 0.4)' }
        ];

        waves.forEach(wave => {
            this.drawWave(wave);
        });
    }

    drawWave(wave) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height); // Start bottom-left

        for (let x = 0; x <= this.width; x += 10) {
            const y = wave.y + Math.sin(x * wave.freq + this.time * wave.speed * 100) * wave.amp
                + Math.cos(x * wave.freq * 0.5 + this.time * wave.speed * 50) * (wave.amp * 0.5);
            this.ctx.lineTo(x, y);
        }

        this.ctx.lineTo(this.width, this.height); // Bottom-right
        this.ctx.lineTo(0, this.height); // Bottom-left again to close
        this.ctx.fillStyle = wave.color;
        this.ctx.fill();
    }

    addFallingItem(record) {
        const x = Math.random() * (this.width - 200) + 100; // Random X, padding
        this.items.push({
            ...record,
            x: x,
            y: -50,
            vy: 2 + (record.intensity || 5) * 0.2, // Velocity based on intensity
            state: 'falling', // falling, sinking
            alpha: 1
        });
    }

    drawItems() {
        // Render falling/sinking text
        this.items.forEach((item, index) => {
            // Update
            if (item.state === 'falling') {
                item.y += item.vy;
                // Check collision with water surface (approximate)
                if (item.y > this.height * 0.5) {
                    item.state = 'sinking';
                    item.vy *= 0.3; // Slow down in water
                }
            } else if (item.state === 'sinking') {
                item.y += item.vy;
                item.alpha -= 0.002;
            }

            // Remove if off screen or invisible
            if (item.y > this.height + 100 || item.alpha <= 0) {
                this.items.splice(index, 1);
                return;
            }

            // Draw
            this.ctx.save();
            this.ctx.globalAlpha = item.alpha;
            this.ctx.font = '20px "Zen Kaku Gothic New", sans-serif';

            // Text Shadow/Glow based on emotion
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = this.getEmotionColor(item.emotion);
            this.ctx.shadowBlur = 10;

            this.ctx.fillText(item.text, item.x, item.y);
            this.ctx.restore();
        });
    }

    getEmotionColor(emotion) {
        const colors = {
            anger: '#ef5350',
            sadness: '#42a5f5',
            joy: '#66bb6a',
            fear: '#ab47bc',
            laziness: '#a1887f',
            desire: '#d81b60',
            neutral: '#78909c'
        };
        return colors[emotion] || '#ffffff';
    }

    addBubble(record) {
        const x = Math.random() * (this.width - 100) + 50;
        this.bubbles.push({
            ...record,
            x: x,
            y: this.height + 50,
            modelY: this.height + 50, // Physical position
            vy: 0.5 + Math.random() * 1.0,
            sway: Math.random() * 0.05,
            phase: Math.random() * Math.PI * 2,
            alpha: 0
        });
    }

    drawBubbles() {
        this.bubbles.forEach((bubble, index) => {
            // Update
            bubble.modelY -= bubble.vy;
            bubble.y = bubble.modelY;
            bubble.x += Math.sin(this.time + bubble.phase) * 0.5;

            // Fade in
            if (bubble.alpha < 0.8) bubble.alpha += 0.01;

            // Remove if top reached
            if (bubble.y < -50) {
                this.bubbles.splice(index, 1);
                return;
            }

            // Draw Bubble
            this.ctx.save();
            this.ctx.globalAlpha = bubble.alpha;
            this.ctx.strokeStyle = this.getEmotionColor(bubble.emotion);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, 20 + (bubble.text.length * 2), 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fill();

            // Text inside bubble
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px "Zen Kaku Gothic New"';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(bubble.text, bubble.x, bubble.y);
            this.ctx.restore();
        });
    }

    updateEnvironment() {
        // Randomly spawn bubbles
        if (Math.random() < 0.005) {
            const record = this.storage.getRandomRecord();
            if (record) {
                this.addBubble(record);
            }
        }

        // Update Color
        const stats = this.storage.getEmotionStats();
        if (!stats || stats.count === 0) return;

        // Calculate Target Color offset based on dominant emotion
        let targetOffset = { r: 0, g: 0, b: 0 };

        // Heuristic color mixing
        const factor = 20 / stats.count; // Weight decreases as count increases, but total sum matters

        targetOffset.r += stats.anger * 5 * factor;
        targetOffset.g -= stats.anger * 2 * factor;

        targetOffset.b += stats.sadness * 5 * factor;

        targetOffset.r += stats.joy * 3 * factor;
        targetOffset.g += stats.joy * 4 * factor;

        targetOffset.r += stats.fear * 3 * factor;
        targetOffset.b += stats.fear * 3 * factor;

        // Laziness adds muddy/brown tone
        targetOffset.r += stats.laziness * 4 * factor;
        targetOffset.g += stats.laziness * 3 * factor;
        targetOffset.b += stats.laziness * 2 * factor;

        // Desire adds strong Pink/Red (R+B, less G)
        targetOffset.r += stats.desire * 5 * factor;
        targetOffset.b += stats.desire * 3 * factor;
        targetOffset.g -= stats.desire * 2 * factor;

        const targetStart = [
            Math.min(255, Math.max(0, this.baseColors.start[0] + targetOffset.r)),
            Math.min(255, Math.max(0, this.baseColors.start[1] + targetOffset.g)),
            Math.min(255, Math.max(0, this.baseColors.start[2] + targetOffset.b))
        ];

        // Lerp towards target
        this.currentColors.start = this.lerpColor(this.currentColors.start, targetStart, 0.005);
    }

    lerpColor(current, target, factor) {
        return [
            current[0] + (target[0] - current[0]) * factor,
            current[1] + (target[1] - current[1]) * factor,
            current[2] + (target[2] - current[2]) * factor
        ];
    }
}
