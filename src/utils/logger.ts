import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, transports, Logger } from 'winston';
import winston from 'winston/lib/winston/transports/index.d.ts'
import app from '../config/config';

const { environment, logging } = app;
const { combine, colorize, splat, printf, timestamp } = format;

const formatter = printf((info: any) => {
  const { level, message, timestamp: ts, ...restMeta } = info;

  return `[ ${ts} ] - [ ${level} ] ${message}`;
});

if (!fs.existsSync(logging.dir)) {
  fs.mkdirSync(logging.dir);
}

const trans: winston.ConsoleTransportInstance[] = [];

if (environment === 'development') {
  trans.push(new transports.Console());
}

const logger = createLogger({
  level: logging.level,
  format: combine(splat(), colorize(), timestamp(), formatter),
  transports: [
    ...trans,
    new DailyRotateFile({
      maxSize: logging.maxSize,
      maxFiles: logging.maxFiles,
      datePattern: logging.datePattern,
      zippedArchive: true,
      filename: `${logging.dir}/${logging.level}-%DATE%.log`
    })
  ]
});

export { logger };
