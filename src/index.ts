import app from './app';
import config from './config/config';
import { logger } from './utils/logger';

const {port, host} = config;

app.listen(+port, host, () => {
  logger.log('info', `Server started at http://${host}:${port}`);
});

