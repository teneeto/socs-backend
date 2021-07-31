import config from '@config/index';
import httpStatus from 'http-status';
import APIError from '@helpers/APIErrors';
import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import joiErrorFormatter from '@helpers/joi_error_formatter';
import { ValidationError as JoiValidationError } from '@hapi/joi';
import { ForeignKeyViolationError, ValidationError } from 'objection';

function customError() {
  const handler = (
    error: ExpressErrorInterface,
    _req: Request,
    res: Response,
    _next?: NextFunction
  ) => {
    const response: ErrorResponseInterface = {
      payload: null,
      stack: error.stack,
      errors: error.errors,
      statusCode: error.status,
      message: error.message || String(httpStatus[error.status])
    };

    if (config.env !== 'development') {
      delete response.stack;
    }
    res.status(error.status).json(response);
  };

  const converter = (
    error: ExpressErrorInterface,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    let convertedError: Error = error;

    if (isCelebrateError(error)) {
      convertedError = new APIError({
        payload: {},
        message: 'Invalid fields',
        status: httpStatus.BAD_REQUEST,
        errors:
          joiErrorFormatter(
            (error.details as unknown) as Map<string, JoiValidationError>
          ) || {}
      });
    }

    if (error instanceof ValidationError) {
      convertedError = new APIError({
        errors: error.data,
        message: 'Knex ValidationError',
        status: httpStatus.BAD_REQUEST
      });
    }

    if (error instanceof ForeignKeyViolationError) {
      convertedError = new APIError({
        status: httpStatus.CONFLICT,
        errors: { message: error.message },
        message: 'Knex ForeignKeyViolationError'
      });
    }

    if (!(convertedError instanceof APIError)) {
      convertedError = new APIError({
        message: error.message,
        status: error.status,
        stack: error.stack,
        errors: null
      });
    }

    return handler(
      (convertedError as unknown) as ExpressErrorInterface,
      req,
      res
    );
  };

  // catch 404 errors
  const notFound = (req: Request, res: Response) => {
    const error = new APIError({
      message: 'Not found',
      status: httpStatus.NOT_FOUND,
      stack: undefined,
      errors: null
    });

    return handler((error as unknown) as ExpressErrorInterface, req, res);
  };

  return { handler, converter, notFound };
}

export default customError();
