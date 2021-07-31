import * as Knex from 'knex';
import { users } from './dummy.json';
import { TableNames } from '@typings/global_enums';
import { PaymentInterface } from '@typings/payment';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TableNames.PAYMENTS).del();

  // Using dummy users
  const [user_one, user_two, user_three] = users;

  // Inserts seed entries
  await knex<PaymentInterface>(TableNames.PAYMENTS).insert([
    {
      amount: 12000,
      user_id: user_one.id,
      wallet_id: '9ea94172-9447-4ac4-80ec-31e551e43037'
    },
    {
      amount: 12000,
      user_id: user_two.id,
      wallet_id: 'b9ba91b1-8e9b-4247-adb3-c23a8086ff4d'
    },
    {
      amount: 120000,
      user_id: user_three.id,
      wallet_id: 'bca28b17-582e-4026-83ae-78eabc546f18'
    }
  ]);
}
