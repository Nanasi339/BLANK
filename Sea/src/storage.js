class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'ocean_app_data';
        this.data = this.load();
        console.log('StorageManager initialized', this.data);
    }

    load() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
        return this.initData();
    }

    initData() {
        return {
            currentOceanId: 'default',
            oceans: {
                'default': {
                    name: 'Main Ocean',
                    records: [],
                    created_at: Date.now()
                }
            }
        };
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    }

    get currentOceanId() {
        return this.data.currentOceanId;
    }

    get currentOcean() {
        return this.data.oceans[this.data.currentOceanId];
    }

    saveRecord(record) {
        const id = this.currentOceanId;
        const newRecord = {
            id: this.generateUUID(),
            timestamp: Date.now(),
            ...record
        };

        if (!this.data.oceans[id]) {
            console.error('Ocean not found:', id);
            return;
        }

        this.data.oceans[id].records.push(newRecord);
        this.save();
        console.log('Record saved:', newRecord);
        return newRecord;
    }

    createOcean(name) {
        const id = this.generateUUID();
        this.data.oceans[id] = {
            name: name,
            records: [],
            created_at: Date.now()
        };
        this.save();
        return id;
    }

    switchOcean(id) {
        if (this.data.oceans[id]) {
            this.data.currentOceanId = id;
            this.save();
            return true;
        }
        return false;
    }

    deleteOcean(id) {
        if (id === 'default') return false; // Cannot delete default
        if (this.data.oceans[id]) {
            delete this.data.oceans[id];
            if (this.data.currentOceanId === id) {
                this.data.currentOceanId = 'default';
            }
            this.save();
            return true;
        }
        return false;
    }

    getAllOceans() {
        return Object.entries(this.data.oceans).map(([id, ocean]) => ({
            id,
            name: ocean.name,
            count: ocean.records.length
        }));
    }

    getRandomRecord() {
        const records = this.currentOcean.records;
        if (records.length === 0) return null;
        return records[Math.floor(Math.random() * records.length)];
    }

    getEmotionStats() {
        const records = this.currentOcean.records;
        if (records.length === 0) return null;

        const stats = {
            anger: 0,
            sadness: 0,
            joy: 0,
            fear: 0,
            laziness: 0,
            desire: 0,
            neutral: 0,
            count: records.length
        };

        records.forEach(r => {
            if (stats[r.emotion] !== undefined) {
                stats[r.emotion]++;
            }
        });

        return stats;
    }

    clearOcean(id) {
        if (this.data.oceans[id]) {
            this.data.oceans[id].records = [];
            this.save();
            return true;
        }
        return false;
    }

    exportToJSON() {
        return JSON.stringify(this.data, null, 2);
    }

    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            // Basic validation
            if (!data.oceans || !data.currentOceanId) {
                throw new Error('Invalid data format');
            }
            this.data = data;
            this.save();
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            alert('データの読み込みに失敗しました。\nフォーマットが正しいか確認してください。');
            return false;
        }
    }

    resetData() {
        this.data = this.initData();
        this.save();
    }
}
