// Imports removed for local file support


document.addEventListener('DOMContentLoaded', () => {
    console.log('Project "Ocean of Thoughts" initializing...');

    const canvas = document.getElementById('ocean-canvas');
    const storage = new StorageManager();
    const ocean = new OceanRenderer(canvas, storage);
    const ui = new UIManager(document.getElementById('ui-layer'), ocean, storage);

    // Initial Resize
    setTimeout(() => ocean.resize(), 100);
    window.addEventListener('resize', () => ocean.resize());

    // Start Loop
    function animate() {
        ocean.draw();
        requestAnimationFrame(animate);
    }
    animate();
});
