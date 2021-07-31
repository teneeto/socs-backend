import * as Knex from 'knex';
import { users } from './dummy.json';
import { WalletInterface } from '@typings/wallet';
import { TableNames } from '@typings/global_enums';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TableNames.WALLETS).del();

  // Using dummy users
  const [user_one, user_two, user_three] = users;

  // Inserts seed entries
  await knex<WalletInterface>(TableNames.WALLETS).insert([
    {
      balance: 2800,
      user_id: user_one.id,
      id: '9ea94172-9447-4ac4-80ec-31e551e43037'
    },
    {
      balance: 40982,
      user_id: user_two.id,
      id: 'b9ba91b1-8e9b-4247-adb3-c23a8086ff4d'
    },
    {
      balance: 1500,
      user_id: user_three.id,
      id: 'bca28b17-582e-4026-83ae-78eabc546f18'
    }
  ]);
}
