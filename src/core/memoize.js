const memoize = (func, options = {}) => {
    const {
        maxSize = Infinity,
        evictionStrategy = 'LRU',
        ttl = null,
        customEviction = null
    } = options;

    const cache = new Map();
    const timestamps = new Map();
    const usageCount = new Map();

    const getKey = (args) => JSON.stringify(args);

    const evictIfNeeded = () => {
        if (cache.size <= maxSize) {
            return;
        }

        let keyToDelete = null;

        switch (evictionStrategy) {
            case 'LRU':
                keyToDelete = cache.keys().next().value;
                break;

            case 'TTL':
                const now = Date.now();
                for (const [key, time] of timestamps.entries()) {
                    if (now - time > ttl) {
                        keyToDelete = key;
                        break;
                    }
                }
                if (!keyToDelete) {
                    keyToDelete = cache.keys().next().value;
                }
                break;

            case 'LFU':
                let minUsage = Infinity;
                for (const [key, count] of usageCount.entries()) {
                    if (count < minUsage) {
                        minUsage = count;
                        keyToDelete = key;
                    }
                }
                break;

            case 'CUSTOM':
                if (typeof customEviction === 'function') {
                    keyToDelete = customEviction(cache, timestamps, usageCount);
                }
                break;
        }

        if (keyToDelete) {
            cache.delete(keyToDelete);
            timestamps.delete(keyToDelete);
            usageCount.delete(keyToDelete);
        }
    };

    return (...args) => {
        const key = getKey(args);
        const now = Date.now();

        if (ttl !== null && cache.has(key)) {
            const age = now - (timestamps.get(key) || 0);
            if (age > ttl) {
                cache.delete(key);
                timestamps.delete(key);
                usageCount.delete(key);
            }
        }

        if (!cache.has(key)) {
            const result = func(...args);
            cache.set(key, result);
            timestamps.set(key, now);
            usageCount.set(key, 1);
            evictIfNeeded();
        } else {
            if (evictionStrategy === 'LRU') {
                const value = cache.get(key);
                cache.delete(key);
                cache.set(key, value);
            }

            usageCount.set(key, (usageCount.get(key) || 0) + 1);

            timestamps.set(key, now);
        }

        return cache.get(key);
    };
};

export { memoize };