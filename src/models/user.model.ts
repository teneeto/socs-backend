import objectionGuid from 'objection-guid';
import objectionUnique from 'objection-unique';
import { TableNames } from '@typings/global_enums';
import bcryptService from '@services/bcrypt.service';
import { UserInterface, AddressInterface } from '@typings/user';
import {
  Model,
  mixin,
  ModelObject,
  ModelOptions,
  QueryContext,
  ToJsonOptions
} from 'objection';
import { Role, Gender, UserStatus, Availability } from '@typings/user';

const convertModelIdToGuid = objectionGuid();

const unique = objectionUnique({
  fields: ['email', 'phone'],
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

export default class User extends mixin(Model, [convertModelIdToGuid, unique]) {
  id!: string;
  role!: Role;
  phone!: string;
  email!: string;
  gender!: Gender;
  image?: string;
  created_at!: Date;
  updated_at!: Date;
  password!: string;
  last_name!: string;
  status!: UserStatus;
  first_name!: string;
  is_delete!: boolean;
  is_verified!: boolean;
  address?: AddressInterface;
  availability?: Availability;

  // Table name is the only required property.
  static tableName = TableNames.USERS;

  async $beforeInsert(context: QueryContext) {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.
    await super.$beforeInsert(context);
    this.password = bcryptService.hashPassword(this.password);
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

    // Only run this block if user updates are password update
    if (this.password) {
      this.password = bcryptService.hashPassword(this.password);
    }
  }

  $toJson(opt?: ToJsonOptions | undefined): ModelObject<this> {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.
    // user Model virtual hook that helps removes user password on retrieval
    const result = (super.$toJson(opt) as unknown) as UserInterface;
    const { password: _, ...payload } = result;
    return (payload as unknown) as ModelObject<this>;
  }

  static get relationMappings() {
    // relationMappings getter is accessed lazily when you execute
    // your first query that needs it. Therefore if you `require`
    // your models inside the getter, you don't end up with a require loop.
    // Note that only one end of the relation needs to be required like
    // this, not both. `relationMappings` can also be a method or
    // a thunk if you prefer those instead of getters.
    const Wallet = require('@models/wallet.model');
    const Request = require('@models/request.model');
    const Payment = require('@models/payment.model');

    return {
      [TableNames.WALLETS]: {
        relation: Model.HasOneRelation,
        modelClass: Wallet,
        join: {
          from: `${TableNames.USERS}.id`,
          to: `${TableNames.WALLETS}.user_id`
        }
      },

      [TableNames.PAYMENTS]: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: `${TableNames.USERS}.id`,
          to: `${TableNames.PAYMENTS}.user_id`
        }
      },

      [TableNames.REQUESTS]: {
        relation: Model.HasManyRelation,
        modelClass: Request,
        join: {
          from: `${TableNames.USERS}.id`,
          to: `${TableNames.REQUESTS}.user_id`
        }
      }
    };
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: [
      'role',
      'phone',
      'email',
      'gender',
      'status',
      'password',
      'last_name',
      'is_delete',
      'first_name',
      'is_verified'
    ],

    properties: {
      id: { type: 'string' },
      image: {
        type: 'string',
        default: `https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp`
      },
      password: { type: 'string' },
      email: { type: 'string', format: 'email' },
      is_delete: { type: 'boolean', default: false },
      is_verified: { type: 'boolean', default: false },
      role: {
        type: 'string',
        default: Role.CUSTOMER,
        enum: [Role.AGENT, Role.ADMIN, Role.CUSTOMER, Role.SUPER_ADMIN]
      },
      status: {
        type: 'string',
        default: UserStatus.ONLINE,
        enum: [UserStatus.ONLINE, UserStatus.OFFLINE, UserStatus.AWAY]
      },
      gender: {
        type: 'string',
        default: Gender.MALE,
        enum: [Gender.MALE, Gender.FEMALE]
      },
      availability: {
        type: 'string',
        enum: [Availability.DELIVERY, Availability.PICK_UP]
      },
      last_name: { type: 'string', minLength: 1, maxLength: 255 },
      first_name: { type: 'string', minLength: 1, maxLength: 255 },
      address: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          state: { type: 'string' },
          address: { type: 'string' },
          country: { type: 'string' },
          postal_code: { type: 'string' }
        }
      }
    }
  };
}
