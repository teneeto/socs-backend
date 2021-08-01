import httpStatus from "http-status";
import User from "@models/user.model";
import sendResponse from "@helpers/response";
import { UserInterface } from "@typings/user";
import authService from "@services/auth.service";
import { ResponseInterface } from "@typings/helpers";
import bcryptService from "@services/bcrypt.service";
import { Request, Response, NextFunction } from "express";

/**
 *
 * @class
 * @classdesc Class representing the authentication controller
 * @name AuthController
 *
 */
export default class AuthController {
  /**
   * Route: POST: /auth/signup
   * @async
   * @function signup
   * @description signup a new user
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @returns {Promise<ResponseInterface | void>} {Promise<ResponseInterface | void>}
   * @memberof AuthController
   */
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const { phone } = req.body as UserInterface;

      const userExits = await User.query().findOne({ phone, is_delete: false });

      if (userExits) {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            statusCode: httpStatus.BAD_REQUEST,
            message: "account already registered with us",
            errors: { phone: "account already registered with us" },
          })
        );
      }
      // const trx = await knex.transaction();
      const user = await User.query().insert({ ...req.body });

      return res.status(httpStatus.CREATED).json(
        sendResponse({
          payload: user,
          message: "success",
          statusCode: httpStatus.CREATED,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Route: POST: /auth/signin
   * @async
   * @function signin
   * @description signin a registered user
   * @param {object} req - HTTP Request object
   * @param {object} res - HTTP Response object
   * @returns {Promise<ResponseInterface | void>} {Promise<ResponseInterface | void>}
   * @memberof AuthController
   */
  static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ResponseInterface | void> {
    try {
      const { phone, password } = req.body as UserInterface;

      const user = await User.query().findOne({ phone, is_delete: false });

      if (!user) {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse({
            message: "User does not exist",
            statusCode: httpStatus.NOT_FOUND,
            errors: { error: "User does not exist" },
          })
        );
      }

      const correctPassword = bcryptService.comparePassword(
        password,
        user.password
      );

      if (!correctPassword) {
        return res.json(
          sendResponse({
            statusCode: httpStatus.BAD_REQUEST,
            message: "invalid phone or password",
            errors: { error: "invalid phone or password" },
          })
        );
      }

      const token = await authService.issue(user);

      return res.status(httpStatus.OK).json(
        sendResponse({
          token,
          payload: user,
          message: "success",
          statusCode: httpStatus.OK,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
