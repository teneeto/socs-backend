interface EnvironmentInterface extends NodeJS.ProcessEnv {
  PORT: string;
  JWT_EXPIRY: string;
  JWT_SECRET: string;
  MAIL_MASTER: string;
  MAIL_SENDER: string;
  BCRYPT_ROUND: string;
  DATA_BASE_HOST: string;
  DATA_BASE_USER: string;
  DATA_BASE_NAME: string;
  DEBUG_DATA_BASE: string;
  MAIL_GUN_DOMAIN: string;
  MAIL_GUN_API_KEY: string;
  PAY_STACK_API_KEY: string;
  DATA_BASE_DIALECT: string;
  DATA_BASE_PASSWORD: string;
  NODE_ENV: 'production' | 'development' | 'test';
}

interface ErrorResponseInterface {
  message: string;
  errors: string;
  stack: string | undefined;
  statusCode: number;
  payload?: object | null;
}

interface ExpressErrorInterface extends Error {
  errors: string;
  status: number;
}
