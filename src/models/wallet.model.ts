import objectionGuid from 'objection-guid';
import objectionUnique from 'objection-unique';
import { TableNames } from '@typings/global_enums';
import { Model, mixin, ModelOptions, QueryContext } from 'objection';

const convertModelIdToGuid = objectionGuid();

const unique = objectionUnique({
  fields: ['user_id'],
  identifiers: ['id']
});

/**
 *
 * @class
 * @see https://vincit.github.io/objection.js/guide/models.html
 * @classdesc Class representing the User database model
 * @extends Model
 *
 */

export default class Wallet extends mixin(Model, [
  convertModelIdToGuid,
  unique
]) {
  id!: string;
  balance!: number;
  user_id!: string;
  created_at!: Date;
  updated_at!: Date;

  // Table name is the only required property.
  static tableName = TableNames.WALLETS;

  async $beforeInsert(context: QueryContext) {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.
    await super.$beforeInsert(context);
    this.created_at = (new Date().toISOString() as unknown) as Date;
    this.updated_at = (new Date().toISOString() as unknown) as Date;
  }

  async $beforeUpdate(
    options: ModelOptions,
    context: QueryContext
  ): Promise<void> {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.

    await super.$beforeUpdate(options, context);

    this.updated_at = (new Date().toISOString() as unknown) as Date;
  }

  static get relationMappings() {
    // relationMappings getter is accessed lazily when you execute
    // your first query that needs it. Therefore if you `require`
    // your models inside the getter, you don't end up with a require loop.
    // Note that only one end of the relation needs to be required like
    // this, not both. `relationMappings` can also be a method or
    // a thunk if you prefer those instead of getters.
    const Payment = require('@models/payment.model');

    return {
      [TableNames.PAYMENTS]: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: `${TableNames.WALLETS}.id`,
          to: `${TableNames.PAYMENTS}.wallet_id`
        }
      }
    };
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['id', 'user_id', 'balance'],

    properties: {
      id: { type: 'string' },
      balance: { type: 'number' },
      user_id: { type: 'string' }
    }
  };
}
