import * as Knex from 'knex';
import { TableNames } from '@typings/global_enums';

/**
 *
 * @see http://knexjs.org/#Schema
 * @typedef {import('knex')} Knex
 * @description request migration table
 *
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable(TableNames.WALLETS, async function (table) {
      table
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.float('balance').notNullable();
      table.uuid('user_id').notNullable();
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(TableNames.WALLETS)
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
