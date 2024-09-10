import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

export class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
            }));
        }
    }

    private addRequestId(meta: any = {}): any {
        if (!meta.requestId) {
            meta.requestId = uuidv4();
        }
        return meta;
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, this.addRequestId(meta));
    }

    error(message: string, meta?: any): void {
        this.logger.error(message, this.addRequestId(meta));
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, this.addRequestId(meta));
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, this.addRequestId(meta));
    }
}