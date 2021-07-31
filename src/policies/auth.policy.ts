import httpStatus from 'http-status';
import sendResponse from '@helpers/response';
import authService from '@services/auth.service';
import { Request, Response, NextFunction } from 'express';

/**
 * Function representing the Authorization check for authenticated users
 * @function AuthToken
 * @description Authenticate users, admins and super admins middleware
 */

/**
 *
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {callback} next - The callback that passes the request
 * to the next handler
 * @returns {Promise<void | Response<any, Record<string, any>>>} {Promise<void | Response<any, Record<string, any>>>} Returns the Response object containing token field with the verified out token assigned to the user
 */

export default async function AuthToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response<any, Record<string, any>>> {
  let tokenToVerify: string | null = null;
  const signature = req.header('Authorization');
  const content = signature ? signature.split(' ') : false;

  console.log("validating")

  if (content && content.length === 2 && content[0] === 'Bearer') {
    tokenToVerify = content[1];
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.body.token;
  }

  if (tokenToVerify) {
    try {
      const token = await authService.verify(tokenToVerify);
      req.token = token;
      return next();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json(
        sendResponse({
          message: 'Invalid Token',
          errors: { error: 'Invalid Token' },
          statusCode: httpStatus.UNAUTHORIZED
        })
      );
    }
  }

  return res.status(httpStatus.UNAUTHORIZED).json(
    sendResponse({
      message: 'No Token found',
      statusCode: httpStatus.UNAUTHORIZED,
      errors: { error: 'No Authorization found' }
    })
  );
}
