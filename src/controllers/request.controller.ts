import httpStatus from 'http-status';
import sendResponse from '@helpers/response';
import RequestModel from '@models/request.model';
import { ResponseInterface } from '@typings/helpers';
import { NextFunction, Request, Response } from 'express';

/**
 *
 * @class
 * @classdesc Class representing the user controller
 * @name RequestController
 *
 */

export default class RequestController {
  /**
   * @description creates,updates the status of a request based on the agent's response
   * Route: POST: /requests/:id/
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {Promise<ResponseInterface | void >} res - HTTP Response object
   * @memberof RequestController
   */
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const { id: requestId } = req.params;

      const request = await RequestModel.query().findOne({
        id: requestId,
        agent_id: req.token.id
      });

      if (!request) {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            message: 'invalid request id',
            statusCode: httpStatus.NOT_FOUND,
            errors: { error: 'Request  does not exist' }
          })
        );
      }

      const body: Object = req.body;
      const updatedRequest = await request.$query().patchAndFetch(body);

      return res.status(httpStatus.OK).json(
        sendResponse({
          payload: updatedRequest,
          message: 'success',
          statusCode: httpStatus.OK
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const { id: requestId } = req.params;
      
      const request = await RequestModel.query().findOne({
        id: requestId,
        agent_id: req.token.id,
        user_id: req.token.id
      });

      if (!request) {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            message: 'invalid request id',
            statusCode: httpStatus.NOT_FOUND,
            errors: { error: 'Request  does not exist' }
          })
        );
      }

      const requestData = await RequestModel.query().insert({ ...req.body });

      return res.status(httpStatus.CREATED).json(
        sendResponse({
          payload: requestData,
          message: 'success',
          statusCode: httpStatus.CREATED
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
