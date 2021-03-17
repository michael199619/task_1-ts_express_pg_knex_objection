import * as dotenv from 'dotenv';
import app from '../../package.json';
import messages from '../utils/langErrors';

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

export default {
  saveLessonsCount: (process.env.SAVE_LESSONS_COUNT || 300) as number,
  saveLessonsDays: (process.env.SAVE_LESSONS_DAYS || 365) as number,
  messages,
  name: app.name,
  host: process.env.APP_HOST || '127.0.0.1',
  environment: process.env.NODE_ENV || 'development',
  port: (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.APP_PORT) || '8000',
  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug',
    maxSize: process.env.LOGGING_MAX_SIZE || '20m',
    maxFiles: process.env.LOGGING_MAX_FILES || '7d',
    datePattern: process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD',
  },
};
