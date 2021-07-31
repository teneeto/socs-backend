import objectionGuid from 'objection-guid';
import { TableNames } from '@typings/global_enums';
import { Model, mixin, ModelOptions, QueryContext } from 'objection';

const convertModelIdToGuid = objectionGuid();

/**
 *
 * @class
 * @see https://vincit.github.io/objection.js/guide/models.html
 * @classdesc Class representing the User database model
 * @extends Model
 *
 */

export default class Payment extends mixin(Model, [convertModelIdToGuid]) {
  id!: string;
  amount!: number;
  user_id!: string;
  created_at!: Date;
  updated_at!: Date;
  wallet_id!: string;

  // Table name is the only required property.
  static tableName = TableNames.PAYMENTS;

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

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['id', 'amount', 'wallet_id', 'user_id'],

    properties: {
      id: { type: 'string' },
      amount: { type: 'number' },
      user_id: { type: 'string' },
      wallet_id: { type: 'string' }
    }
  };
}
