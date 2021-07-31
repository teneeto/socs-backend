import * as Knex from 'knex';
import { users } from './dummy.json';
import { TableNames } from '@typings/global_enums';
import {
  ServiceType,
  TransactionType,
  TransactionInterface
} from '@typings/transaction';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TableNames.TRANSACTIONS).del();

  // Using dummy users
  const [user_one, user_two, user_three] = users;

  // Inserts seed entries
  await knex<TransactionInterface>(TableNames.TRANSACTIONS).insert([
    {
      amount: 40000,
      service_type: ServiceType.PICKUP,
      transaction_type: TransactionType.BANK_TRANSFER,
      request_id: '92b4c256-c845-4148-9524-e296f53ad9d0',
      location: '15 Asajon Way, Eti-Osa 234001, Sangotedo',
      user_fullname: `${user_one.first_name} ${user_one.last_name}`,
      agent_fullname: `${user_one.first_name} ${user_one.last_name}`
    },
    {
      amount: 40000,
      service_type: ServiceType.DELIVERY,
      transaction_type: TransactionType.BANK_TRANSFER,
      request_id: 'fedc3c6f-ff65-4742-a08e-722af148d8f2',
      location: '70 Asajon Way, Eti-Osa 234001, Sangotedo',
      user_fullname: `${user_two.first_name} ${user_two.last_name}`,
      agent_fullname: `${user_two.first_name} ${user_two.last_name}`
    },
    {
      amount: 40000,
      service_type: ServiceType.PICKUP,
      transaction_type: TransactionType.BANK_TRANSFER,
      request_id: 'e34ecd52-acc5-48f8-81bc-05cd4ae0ee5b',
      location: '17 Asajon Way, Eti-Osa 234001, Sangotedo',
      user_fullname: `${user_three.first_name} ${user_three.last_name}`,
      agent_fullname: `${user_three.first_name} ${user_three.last_name}`
    }
  ]);
}
