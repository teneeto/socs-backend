import httpStatus from 'http-status';
import { Role } from '@typings/user';
import sendResponse from '@helpers/response';
import { Request, Response, NextFunction } from 'express';

/**
 * Function representing the Authorization check for app admins
 * @function isAdmin
 * @description Authenticate admins and super admins middleware
 */

/**
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {callback} next - The callback that passes the request to the next handler
 * @returns {void | Response<any, Record<string, any>>} {void | Response<any, Record<string, any>>} Response object containing an error due
 * to invalid privileges or no valid super access credentials in the request
 */

export default function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> {
  const { role } = req.token;

  if (role !== Role.ADMIN) {
    return res.json(
      sendResponse({
        statusCode: httpStatus.UNAUTHORIZED,
        errors: { error: 'Invalid credentials' },
        message: 'You are not Authorized to perform this operation!'
      })
    );
  }

  return next();
}
