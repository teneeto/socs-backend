import { UserTokenType } from '@typings/user';

declare global {
  export namespace Express {
    interface Request {
      token: UserTokenType;
    }
  }
}
