import jwt from 'jsonwebtoken';
import config from '@config/index';
import { UserInterface } from '@typings/user';

interface AuthServiceInterface {
  issue: (payload: UserInterface) => Promise<string>;
  verify: (token: string) => Promise<any>;
}

/**
 * User authentication service builder factory
 * @function authService
 * @description user authentication issuance and verification service
 * @exports AuthServiceInterface
 */

function authService(): AuthServiceInterface {
  /**
   * @function issue
   * @param {UserInterface} payload - user payload object
   * @returns {Promise<string>} Returns the signed encrypted user issued object as string
   */

  const issue = ({ role, id }: UserInterface): Promise<string> => {
    return new Promise((resolve, reject) =>
      jwt.sign(
        { id, role, sub: id, iat: Date.now() },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRY },
        (error, decoded) => {
          if (error) return reject(error);
          return resolve(`${decoded}`);
        }
      )
    );
  };

  /**
   * @function verify
   * @param {string} token - user token issued string
   * @returns {Promise<any>} Returns the verified decrypted user issued object
   */

  const verify = (token: string): Promise<any> => {
    return new Promise((resolve, reject) =>
      jwt.verify(token, config.JWT_SECRET, (error: any, decoded: any) => {
        if (error) return reject(error);
        return resolve(decoded);
      })
    );
  };

  return { issue, verify };
}

export default authService();
