import * as Knex from 'knex';
import { TableNames } from '@typings/global_enums';
import { Role, Gender, UserStatus, Availability } from '@typings/user';

/**
 *
 * @see http://knexjs.org/#Schema
 * @typedef {import('knex')} Knex
 * @description user migration table
 *
 */

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable(TableNames.USERS, async function (table) {
      table
        .uuid('id')
        .primary()
        .notNullable()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.json('address');
      table.string('image');
      table.string('password').notNullable();
      table.string('last_name').notNullable();
      table.string('first_name').notNullable();
      table.boolean('is_delete').defaultTo(false);
      table.string('email').notNullable().unique();
      table.string('phone').notNullable().unique();
      table.boolean('is_verified').defaultTo(false);
      table.enu('availability', [Availability.DELIVERY, Availability.PICK_UP]);
      table
        .enu('gender', [Gender.MALE, Gender.FEMALE])
        .notNullable()
        .defaultTo(Gender.MALE);
      table
        .enu('status', [UserStatus.AWAY, UserStatus.ONLINE, UserStatus.OFFLINE])
        .notNullable()
        .defaultTo(Role.CUSTOMER);
      table
        .enu('role', [Role.ADMIN, Role.CUSTOMER, Role.SUPER_ADMIN, Role.AGENT])
        .notNullable()
        .defaultTo(Role.CUSTOMER);
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable(TableNames.USERS)
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}
