/**
 * @description Response builder function for user requests
 * @typedef ResponseInterface
 * @function Response
 * @param {string} token - jwt token
 * @param {Error | null} error - error message
 * @param {object | null} payload - response object
 * @param {string} message - message identify the code
 * @param {Number} statusCode - status code of the response
 * @returns {ResponseInterface} {ResponseInterface} Returns the Response object
 */

import { ResponseInterface } from '@typings/helpers';

export default function Response({
  statusCode,
  message,
  payload = null,
  errors = null,
  token = null
}: ResponseInterface): ResponseInterface {
  return {
    statusCode,
    message,
    payload,
    errors,
    token
  };
}
