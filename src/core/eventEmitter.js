class EventEmitter {
    constructor() {
        this.listeners = new Map();
    }

    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(callback);
        return () => this.off(eventName, callback);
    }

    off(eventName, callback) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(callback);
            if (this.listeners.get(eventName).size === 0) {
                this.listeners.delete(eventName);
            }
        }
    }

    emit(eventName, ...args) {
        if (this.listeners.has(eventName)) {
            Array.from(this.listeners.get(eventName)).forEach(callback => {
                try {
                    callback(...args);
                } catch (error) {
                    console.error(`Error in event listener for "${eventName}":`, error);
                }
            });
        }
    }

    listenerCount(eventName) {
        return this.listeners.has(eventName) ? this.listeners.get(eventName).size : 0;
    }

    clearAllListeners() {
        this.listeners.clear();
    }
}

export { EventEmitter }