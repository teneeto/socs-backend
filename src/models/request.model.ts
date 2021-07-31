import objectionGuid from 'objection-guid';
import { RequestStatus } from '@typings/request';
import { TableNames } from '@typings/global_enums';
import { ServiceType } from '@typings/transaction';
import { Model, mixin, ModelOptions, QueryContext } from 'objection';

const convertModelIdToGuid = objectionGuid();

/**
 *
 * @class
 * @see https://vincit.github.io/objection.js/guide/models.html
 * @classdesc Class representing the Request database model
 * @extends Model
 *
 */

export default class Request extends mixin(Model, [convertModelIdToGuid]) {
  id!: string;
  amount!: number;
  user_id!: string;
  agent_id?: string;
  created_at!: Date;
  updated_at!: Date;
  status?: RequestStatus;
  decline_reason?: string;
  service_type!: ServiceType;

  // Table name is the only required property.
  static tableName = TableNames.REQUESTS;

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
    required: ['user_id', 'amount', 'status', 'service_type'],

    properties: {
      id: { type: 'string' },
      amount: { type: 'number' },
      user_id: { type: 'string' },
      agent_id: { type: 'string' },
      decline_reason: { type: 'string' },
      status: {
        type: 'string',
        default: RequestStatus.ONGOING,
        enum: [
          RequestStatus.ACCEPT,
          RequestStatus.DECLINE,
          RequestStatus.ONGOING,
          RequestStatus.COMPLETE
        ]
      },
      service_type: {
        type: 'string',
        default: ServiceType.PICKUP,
        enum: [ServiceType.DELIVERY, ServiceType.PICKUP]
      }
    }
  };
}
