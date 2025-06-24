const LOG_LEVELS = {
    DEBUG: 1,
    INFO: 2,
    ERROR: 3
};

const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO;

const logger = {
    log: (level, message, ...args) => {
        if (LOG_LEVELS[level] >= CURRENT_LOG_LEVEL) {
            const timestamp = new Date().toISOString();
            switch (level) {
                case 'DEBUG':
                    console.debug(`[${timestamp}] [DEBUG] ${message}`, ...args);
                    break;
                case 'INFO':
                    console.info(`[${timestamp}] [INFO] ${message}`, ...args);
                    break;
                case 'ERROR':
                    console.error(`[${timestamp}] [ERROR] ${message}`, ...args);
                    break;
                default:
                    console.log(`[${timestamp}] [UNKNOWN] ${message}`, ...args);
            }
        }
    }
};

const logDecorator = (level = 'INFO') => (func) => {
    const decoratedFunc = function (...args) {
        const functionName = func.name || 'anonymous';
        logger.log(level, `Function "${functionName}" called with arguments:`, args);

        let result;
        try {
            result = func.apply(this, args);
            if (result && typeof result.then === 'function') {
                return result.then((asyncResult) => {
                    logger.log(level, `Function "${functionName}" completed successfully. Result:`, asyncResult);
                    return asyncResult;
                }).catch((error) => {
                    logger.log('ERROR', `Function "${functionName}" failed with error:`, error);
                    throw error;
                });
            }
            logger.log(level, `Function "${functionName}" completed successfully. Result:`, result);
            return result;
        } catch (error) {
            logger.log('ERROR', `Function "${functionName}" failed with error:`, error);
            throw error;
        }
    };
    return decoratedFunc;
};

export { logDecorator, LOG_LEVELS };