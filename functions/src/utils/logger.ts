export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  debug(message: string, meta?: any): void {
    console.debug(`[${this.context}] DEBUG: ${message}`, meta || '');
  }

  info(message: string, meta?: any): void {
    console.info(`[${this.context}] INFO: ${message}`, meta || '');
  }

  warn(message: string, meta?: any): void {
    console.warn(`[${this.context}] WARN: ${message}`, meta || '');
  }

  error(message: string, error?: Error, meta?: any): void {
    console.error(`[${this.context}] ERROR: ${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...meta,
    });
  }
}

export const createLogger = (context: string): Logger => new Logger(context);
