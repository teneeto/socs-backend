import * as Knex from 'knex';
import { users } from './dummy.json';
import { TableNames } from '@typings/global_enums';
import { ServiceType } from '@typings/transaction';
import { RequestInterface, RequestStatus } from '@typings/request';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(TableNames.REQUESTS).del();

  // Using dummy users
  const [user_one, user_two, user_three] = users;

  // Inserts seed entries
  await knex<RequestInterface>(TableNames.REQUESTS).insert([
    {
      amount: 12000,
      user_id: user_one.id,
      status: RequestStatus.ONGOING,
      service_type: ServiceType.PICKUP,
      id: '92b4c256-c845-4148-9524-e296f53ad9d0',
      agent_id: '6b32ca8b-74c0-4670-9dd1-75ec16458454'
    },
    {
      amount: 80000,
      user_id: user_two.id,
      status: RequestStatus.COMPLETE,
      service_type: ServiceType.DELIVERY,
      id: 'fedc3c6f-ff65-4742-a08e-722af148d8f2',
      agent_id: 'e8f12da1-fa76-4ff6-b928-33647ca89f69'
    },
    {
      amount: 4600,
      user_id: user_three.id,
      status: RequestStatus.DECLINE,
      service_type: ServiceType.PICKUP,
      id: 'e34ecd52-acc5-48f8-81bc-05cd4ae0ee5b',
      agent_id: '41ba3dc8-5699-4588-801b-3f5c5d2d5ecb'
    }
  ]);
}
