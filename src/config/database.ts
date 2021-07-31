import debug from 'debug';
import connect from 'knex';
import { Model } from 'objection';
import config from '@config/index';
import databaseConfig from '@knexfile';

// connect to knex database host
const database = connect({
  ...databaseConfig[config.NODE_ENV],
  useNullAsDefault: true,
  pool: {
    min: 2,
    max: 10,
    afterCreate: (conn: any, done: any) => {
      conn.query('SET timezone="UTC";', (err: string) => {
        if (err) {
          console.error('Unable to connect to the database:', err);
          process.exit(1);
        }

        console.info(
          'connection to the database has been established successfully'
        );
        done(err, conn);
      });
    }
  },
  log: {
    deprecate: (msg) => debug(msg),
    warn: (msg: string) => debug(msg),
    error: (msg: string) => debug(msg),
    debug: (msg: string) => debug(msg)
  }
});

// Give the knex database instance to objection.
Model.knex(database);

export default database;
