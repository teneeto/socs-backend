import * as Knex from 'knex';
import { RequestStatus } from '@typings/request';
import { TableNames } from '@typings/global_enums';
import { ServiceType } from '@typings/transaction';

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
    .createTable(TableNames.REQUESTS, async function (table) {
      table
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('agent_id');
      table.uuid('user_id').notNullable();
      table.float('amount').notNullable();
      table
        .enu('status', [
          RequestStatus.ACCEPT,
          RequestStatus.DECLINE,
          RequestStatus.ONGOING,
          RequestStatus.COMPLETE
        ])
        .notNullable();
      table
        .enu('service_type', [ServiceType.DELIVERY, ServiceType.PICKUP])
        .notNullable();
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(TableNames.REQUESTS)
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
