import * as dotenv from 'dotenv';

dotenv.config();

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: 'src/database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: 'src/database/seeds'
    }
  },
  test: {
    client: process.env.DB_CLIENT,
    connection: {
      charset: 'utf8',
      timezone: 'UTC',
      port: process.env.DB_PORT,
      database: process.env.TEST_DB_NAME
    },
    migrations: {
      directory: 'src/database/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: 'src/database/seeds'
    }
  }
};
