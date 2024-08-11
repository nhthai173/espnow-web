module.exports = class JSONDatabase {
    constructor(filename = '') {
        this.data = {};
        if (filename) {
            this.filename = filename;
            this.load();
        }
    }

    load() {
        try {
            this.data = require(this.filename);
        } catch (e) {
            console.log('Error loading JSON file:', e);
        }
    }

    save() {
        try {
            require('fs').writeFileSync(this.filename, JSON.stringify(this.data));
        } catch (e) {
            console.log('Error saving JSON file:', e);
        }
    }

    get(query = {}) {
        if (typeof query === 'number') {
            return this.data[query];
        }
        if (Object.keys(query).length === 0) {
            return this.data;
        }
        return this.data.filter(d => {
            for (let key in query) {
                if (d[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    getFirst() {
        return this.data[0];
    }

    getLast() {
        return this.data[this.data.length - 1];
    }

    getAll() {
        return this.data;
    }

    add(obj) {
        this.data.push(obj);
        this.save();
    }

    update(query, obj) {
        const index = this.data.findIndex(d => {
            for (let key in query) {
                if (d[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
        if (index > -1) {
            this.data[index] = obj;
            this.save();
        }
    }

    remove(query) {
        this.data = this.data.filter(d => {
            for (let key in query) {
                if (d[key] !== query[key]) {
                    return true;
                }
            }
            return false;
        });
        this.save();
    }

    removeAll() {
        this.data = [];
        this.save();
    }

    clear() {
        this.data = {};
        this.save();
    }

    count() {
        return this.data.length;
    }

}