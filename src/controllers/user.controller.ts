import User from '@models/user.model';
import httpStatus from 'http-status';
import sendResponse from '@helpers/response';
import { UserInterface } from '@typings/user';
import { ResponseInterface } from '@typings/helpers';
import { Request, Response, NextFunction } from 'express';

/**
 *
 * @class
 * @classdesc Class representing the user controller
 * @name UserController
 *
 */
export default class UserController {
  /**
   * @description update user profile in the database
   * Route: POST: /users/:id/update
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {Promise<ResponseInterface | void>} res - HTTP Response object
   * @memberof UserController
   */
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const body: UserInterface = req.body;

      const user = await User.query().findOne({ id: req.token.id });

      if (!user) {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            message: 'User does not exist',
            statusCode: httpStatus.NOT_FOUND,
            errors: { error: 'User does not exist' }
          })
        );
      }

      // using $query() on updating user is due unique fields tagged on object model (User)
      // NOTE: Unique validation at update only works with $query methods.
      // follow up and read more here https://github.com/seegno/objection-unique
      await user.$query().patch({ ...body });

      return res.status(httpStatus.OK).json(
        sendResponse({
          payload: user,
          message: 'success',
          statusCode: httpStatus.OK
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description soft-delete user profile in the database
   * Route: POST: /users/:id/delete
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {Promise<ResponseInterface | void>} res - HTTP Response object
   * @memberof UserController
   */
  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const { id } = req.params;

      await User.query().deleteById(id);

      return res
        .status(httpStatus.OK)
        .json(sendResponse({ message: 'success', statusCode: httpStatus.OK }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description get all registered users in the database
   * Route: POST: /users
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @return {Promise<ResponseInterface | void>} res - HTTP Response object
   * @memberof UserController
   */
  static async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const users = await User.query();

      return res.status(httpStatus.OK).json(
        sendResponse({
          payload: users,
          message: 'success',
          statusCode: httpStatus.OK
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

  