import { Joi, Segments } from 'celebrate';
import { RequestStatus } from '@typings/request';
import { ServiceType } from '@typings/transaction'

export default {
  /**
   * @description Validate user signup inputs
   * @param {body} req - Request property object gotten from the request
   * @property {status} body.status - The status of request
   * @property {decline_reason} body.decline_reason - the reason request is declined
   * @property {service_type} body.service_type - the type of service required(Pickup or delivery) is considered
   */
  updateRequest: {
    [Segments.BODY]: Joi.object().keys({
      status: Joi.string()
        .valid(RequestStatus.ACCEPT, RequestStatus.DECLINE)
        .required(),
      decline_reason: Joi.string().when('status', {
        is: RequestStatus.DECLINE,
        then: Joi.required()
      })
    }),
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().guid({ version: 'uuidv4' }).required()
    })
  },

  createRequest: {
    [Segments.BODY]: Joi.object().keys({
      status: Joi.string()
        .valid(RequestStatus.ACCEPT, RequestStatus.DECLINE)
        .required(),
      service_type: Joi.string()
        .valid(ServiceType.DELIVERY, ServiceType.PICKUP)
        .required(),
    }),
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().guid({ version: 'uuidv4' }).required()
    })
  }
};
