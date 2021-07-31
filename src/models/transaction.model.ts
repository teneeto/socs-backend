import database from '@config/database';
import objectionGuid from 'objection-guid';
import { TableNames } from '@typings/global_enums';
import { Model, mixin, QueryContext } from 'objection';
import { ServiceType, TransactionType } from '@typings/transaction';

const convertModelIdToGuid = objectionGuid();

/**
 *
 * @class
 * @classdesc Class representing the Transaction database model
 * @extends Model
 *
 */

// Give the knex database instance to objection.
Model.knex(database);

export default class Transaction extends mixin(Model, [convertModelIdToGuid]) {
  id!: string;
  amount!: number;
  location!: string;
  created_at!: Date;
  updated_at!: Date;
  request_id!: string;
  user_fullname!: string;
  agent_fullname!: string;
  service_type!: ServiceType;
  transaction_type!: TransactionType;

  static tableName = TableNames.TRANSACTIONS;

  async $beforeInsert(context: QueryContext) {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.
    await super.$beforeInsert(context);
    this.created_at = (new Date().toISOString() as unknown) as Date;
    this.updated_at = (new Date().toISOString() as unknown) as Date;
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: [
      'id',
      'amount',
      'location',
      'request_id',
      'service_type',
      'user_fullname',
      'agent_fullname',
      'transaction_type'
    ],

    properties: {
      id: { type: 'string' },
      amount: { type: 'number' },
      location: { type: 'string' },
      request_id: { type: 'string' },
      user_fullname: { type: 'string' },
      agent_fullname: { type: 'string' },
      transaction_type: {
        type: 'string',
        default: TransactionType.CARD,
        enum: [TransactionType.BANK_TRANSFER, TransactionType.CARD]
      },
      service_type: {
        type: 'string',
        default: ServiceType.PICKUP,
        enum: [ServiceType.PICKUP, ServiceType.DELIVERY]
      }
    }
  };
}
