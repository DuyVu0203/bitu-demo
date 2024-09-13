import winston from 'winston';
import { LOG_LEVEL } from '@config/environment';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'index.log',
        }),
    ],
});

export default logger;