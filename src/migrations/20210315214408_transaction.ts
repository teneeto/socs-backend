import * as Knex from 'knex';
import { TableNames } from '@typings/global_enums';
import { ServiceType, TransactionType } from '@typings/transaction';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable(TableNames.TRANSACTIONS, async function (table) {
      table
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.float('amount').notNullable();
      table.string('location').notNullable();
      table.uuid('request_id').notNullable();
      table.string('user_fullname').notNullable();
      table.string('agent_fullname').notNullable();
      table
        .enu('transaction_type', [
          TransactionType.CARD,
          TransactionType.BANK_TRANSFER
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
    .dropTable(TableNames.TRANSACTIONS)
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
