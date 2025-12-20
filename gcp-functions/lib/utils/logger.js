export class Logger {
    context;
    constructor(context) {
        this.context = context;
    }
    debug(message, meta) {
        console.debug(`[${this.context}] DEBUG: ${message}`, meta || '');
    }
    info(message, meta) {
        console.info(`[${this.context}] INFO: ${message}`, meta || '');
    }
    warn(message, meta) {
        console.warn(`[${this.context}] WARN: ${message}`, meta || '');
    }
    error(message, error, meta) {
        console.error(`[${this.context}] ERROR: ${message}`, {
            error: error?.message,
            stack: error?.stack,
            ...meta,
        });
    }
}
export const createLogger = (context) => new Logger(context);
