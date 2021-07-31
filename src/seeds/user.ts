import * as Knex from 'knex';
import { users } from './dummy.json';
import { UserInterface } from '@typings/user';
import { TableNames } from '@typings/global_enums';
import { Role, Gender, UserStatus } from '@typings/user';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TableNames.USERS).del();

  // Using dummy users
  const [user_one, user_two, user_three] = users;

  // Inserts seed entries
  await knex<UserInterface>(TableNames.USERS).insert([
    {
      ...user_one,
      role: Role.CUSTOMER,
      gender: Gender.MALE,
      status: UserStatus.OFFLINE
    },
    {
      ...user_two,
      role: Role.CUSTOMER,
      gender: Gender.FEMALE,
      status: UserStatus.ONLINE
    },
    {
      ...user_three,
      role: Role.CUSTOMER,
      gender: Gender.MALE,
      status: UserStatus.ONLINE
    }
  ]);
}
