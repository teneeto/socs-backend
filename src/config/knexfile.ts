import knex from 'knex';
import path from 'path';
import config from './index';

const defaultOptions = {
  client: 'pg',
  dialect: config.DATA_BASE_DIALECT,
  debug: Boolean(config.DEBUG_DATA_BASE),
  connection: {
    host: config.DATA_BASE_HOST,
    user: config.DATA_BASE_USER,
    database: config.DATA_BASE_NAME,
    password: config.DATA_BASE_PASSWORD
  },
  migrations: {
    extension: 'ts',
    tableName: 'knex_migrations',
    directory: path.resolve(`${process.cwd()}/src/migrations`)
  },
  seeds: { directory: path.resolve(`${process.cwd()}/src/seeds`) }
};

type knexConfigOptions = {
  [key in EnvironmentInterface['NODE_ENV']]: knex.Config;
};

export default {
  test: {
    ...defaultOptions,
    client: 'sqlite3',
    connection: {
      ...defaultOptions.connection,
      filename: path.resolve(`${process.cwd()}/db/database.sqlite`)
    }
  },

  staging: { ...defaultOptions },

  production: { ...defaultOptions },

  development: { ...defaultOptions }
} as knexConfigOptions;
