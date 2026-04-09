import winston from 'winston';
import { env } from '../config/env.js';

const consoleFormat =
  env.NODE_ENV === 'production'
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}: ${message}${extra}`;
        })
      );

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true })),
  transports: [new winston.transports.Console({ format: consoleFormat })]
});

export const stream = {
  write: (message) => logger.http(message.trim())
};
