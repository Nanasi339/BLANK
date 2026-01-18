class UIManager {
    constructor(root, ocean, storage) {
        this.root = root;
        this.ocean = ocean;
        this.storage = storage;
        console.log('UIManager initialized');

        this.render();
    }

    render() {
        this.root.innerHTML = `
            <div class="top-bar">
                <button id="menu-btn" title="Oceans">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                     </svg>
                </button>
                <div id="current-ocean-name">Main Ocean</div>
            </div>

            <div class="input-container">
                <div class="input-card">
                    <h2>海に捧げる</h2>
                    <textarea id="thought-input" placeholder="今、何を感じていますか？" rows="3"></textarea>
                    
                    <div class="control-group">
                        <label>感情の色</label>
                        <div class="emotion-selector" id="emotion-selector">
                            <button class="emotion-btn" data-emotion="anger" style="--btn-color: #ef5350;">怒り</button>
                            <button class="emotion-btn" data-emotion="sadness" style="--btn-color: #42a5f5;">悲しみ</button>
                            <button class="emotion-btn" data-emotion="joy" style="--btn-color: #66bb6a;">喜び</button>
                            <button class="emotion-btn" data-emotion="fear" style="--btn-color: #ab47bc;">恐れ</button>
                            <button class="emotion-btn" data-emotion="laziness" style="--btn-color: #a1887f;">怠惰</button>
                            <button class="emotion-btn" data-emotion="desire" style="--btn-color: #d81b60;">欲望</button>
                            <button class="emotion-btn active" data-emotion="neutral" style="--btn-color: #78909c;">中立</button>
                        </div>
                    </div>

                    <div class="control-group">
                        <label>想いの強さ (1-10)</label>
                        <input type="range" id="intensity-input" min="1" max="10" value="5">
                        <span id="intensity-display">5</span>
                    </div>

                    <button id="submit-btn">海へ還す</button>
                </div>
            </div>

            <!-- Ocean Switcher Modal -->
            <div id="ocean-modal" class="modal hidden">
                <div class="modal-content">
                    <h3>海を渡る</h3>
                    <div id="ocean-list" class="ocean-list"></div>
                    
                    <div class="new-ocean-form">
                        <input type="text" id="new-ocean-name" placeholder="新しい海の名前">
                        <button id="create-ocean-btn">作成</button>
                    </div>

                    <div class="data-actions">
                        <h4>データの管理</h4>
                        <div class="action-buttons">
                            <button id="export-btn" class="secondary-btn">書き出し (保存)</button>
                            <button id="import-btn" class="secondary-btn">読み込み (復元)</button>
                            <input type="file" id="import-file" accept=".json" style="display: none;">
                        </div>
                        <div style="margin-top: 10px;">
                             <button id="reset-btn" class="secondary-btn" style="width: 100%; color: #ef5350; border-color: rgba(239, 83, 80, 0.5);">全てのデータを初期化</button>
                        </div>
                    </div>

                    <button id="close-modal-btn">閉じる</button>
                </div>
            </div>
        `;

        this.updateCurrentOceanName();
        this.setupListeners();
    }

    updateCurrentOceanName() {
        const nameDisplay = this.root.querySelector('#current-ocean-name');
        if (nameDisplay) {
            nameDisplay.textContent = this.storage.currentOcean.name;
        }
    }

    setupListeners() {
        const intensityInput = this.root.querySelector('#intensity-input');
        const intensityDisplay = this.root.querySelector('#intensity-display');
        intensityInput.addEventListener('input', (e) => {
            intensityDisplay.textContent = e.target.value;
        });

        const emotionBtns = this.root.querySelectorAll('.emotion-btn');
        console.log('Found emotion buttons:', emotionBtns.length);
        emotionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Emotion clicked:', btn.dataset.emotion);
                emotionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        const submitBtn = this.root.querySelector('#submit-btn');
        if (submitBtn) {
            console.log('Submit button found');
            submitBtn.addEventListener('click', () => {
                console.log('Submit clicked');
                this.handleSubmit();
            });
        } else {
            console.error('Submit button NOT found');
        }

        // Modal Listeners
        this.root.querySelector('#menu-btn').addEventListener('click', () => this.openModal());
        this.root.querySelector('#close-modal-btn').addEventListener('click', () => this.closeModal());
        this.root.querySelector('#create-ocean-btn').addEventListener('click', () => this.handleCreate());

        // Data Management Listeners
        this.root.querySelector('#export-btn').addEventListener('click', () => this.handleExport());
        const importBtn = this.root.querySelector('#import-btn');
        const fileInput = this.root.querySelector('#import-file');

        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleImport(e));

        this.root.querySelector('#reset-btn').addEventListener('click', () => this.handleReset());
    }

    handleReset() {
        if (confirm('本当に全てのデータを削除して初期化しますか？\nこの操作は取り消せません。')) {
            if (confirm('これが最後の確認です。\n全ての海、全ての想いが消去されます。\nよろしいですか？')) {
                this.storage.resetData();
                alert('初期化しました。');
                window.location.reload();
            }
        }
    }

    handleExport() {
        const data = this.storage.exportToJSON();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ocean_of_thoughts_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const success = this.storage.importFromJSON(e.target.result);
            if (success) {
                alert('データを読み込みました。画面を更新します。');
                window.location.reload();
            }
        };
        reader.readAsText(file);
        // Reset input
        e.target.value = '';
    }

    handleSubmit() {
        const text = this.root.querySelector('#thought-input').value;
        if (!text.trim()) return;

        const emotion = this.root.querySelector('.emotion-btn.active').dataset.emotion;
        const intensity = parseInt(this.root.querySelector('#intensity-input').value, 10);

        console.log('Submitting:', { text, emotion, intensity });

        // Save to storage
        const record = this.storage.saveRecord({
            text,
            emotion,
            intensity
        });

        // Trigger animation
        if (this.ocean) {
            this.ocean.addFallingItem(record);
        }

        // Reset
        this.root.querySelector('#thought-input').value = '';
    }

    openModal() {
        this.renderOceanList();
        this.root.querySelector('#ocean-modal').classList.remove('hidden');
    }

    closeModal() {
        this.root.querySelector('#ocean-modal').classList.add('hidden');
    }

    renderOceanList() {
        const list = this.root.querySelector('#ocean-list');
        list.innerHTML = '';

        const oceans = this.storage.getAllOceans();
        const currentId = this.storage.currentOceanId;

        oceans.forEach(ocean => {
            const item = document.createElement('div');
            item.className = `ocean-item ${ocean.id === currentId ? 'active' : ''}`;
            item.innerHTML = `
                <span class="ocean-name">${ocean.name} (${ocean.count})</span>
                <div class="ocean-actions">
                    ${ocean.id !== 'default'
                    ? '<button class="delete-btn" title="Delete">🗑️</button>'
                    : '<button class="clear-btn" title="Cleanse">✨</button>'}
                </div>
            `;

            // Switch click
            item.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.handleSwitch(ocean.id);
                }
            });

            // Delete click
            const deleteBtn = item.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleDelete(ocean.id);
                });
            }

            // Clear click
            const clearBtn = item.querySelector('.clear-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleClear(ocean.id);
                });
            }

            list.appendChild(item);
        });
    }

    handleSwitch(id) {
        if (this.storage.switchOcean(id)) {
            this.ocean.reset();
            this.updateCurrentOceanName();
            this.closeModal();
        }
    }

    handleCreate() {
        const input = this.root.querySelector('#new-ocean-name');
        const name = input.value.trim();
        if (name) {
            const id = this.storage.createOcean(name);
            this.handleSwitch(id);
            input.value = '';
        }
    }

    handleDelete(id) {
        if (confirm('この海を忘却の彼方へ送りますか？ (削除後は元に戻せません)')) {
            if (this.storage.deleteOcean(id)) {
                this.renderOceanList();
                // If we were on deleted ocean, it switched to default automatically in storage,
                // so we need to reflect that in UI
                if (this.storage.currentOceanId === 'default') {
                    this.ocean.reset();
                    this.updateCurrentOceanName();
                }
            }
        }
    }

    handleClear(id) {
        if (confirm('この海を浄化（リセット）しますか？\n集まった想いが全て消え去ります。')) {
            if (this.storage.clearOcean(id)) {
                this.renderOceanList();
                if (this.storage.currentOceanId === id) {
                    this.ocean.reset();
                }
                alert('海は浄化されました。');
            }
        }
    }
}
