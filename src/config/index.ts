import path from 'path';
import { Joi } from 'celebrate';
import { config as configEnv } from 'dotenv';

/**
 * change working directory back to app root
 * this is needed cause root directory got changed to ${__dirname/src/config} by knex migration
 * changing the root directory back to ./ is needed so dotenv can find and read .env
 */

process.chdir(path.resolve(`${process.env.INIT_CWD}`));

console.info(`Working directory changed to \x1b[35m ${process.cwd()}`);

configEnv();

// define validation for all the env vars
const envVarsSchema = Joi.object<EnvironmentInterface>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(6060),

  DEBUG_DATA_BASE: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),

  DATA_BASE_HOST: Joi.string()
    .default('localhost')
    .description('Database host name')
    .required(),

  DATA_BASE_DIALECT: Joi.string()
    .default('postgres')
    .description('Database dialect')
    .required(),

  DATA_BASE_PASSWORD: Joi.string()
    .default('internet24')
    .description('Database password')
    .required(),

  DATA_BASE_USER: Joi.string()
    .default('postgres')
    .description('Database user')
    .required(),

  DATA_BASE_NAME: Joi.string()
    .default('socs')
    .description('Database name')
    .required(),

  MAIL_MASTER: Joi.string().required(),

  MAIL_SENDER: Joi.string().required(),

  MAIL_GUN_DOMAIN: Joi.string().required(),

  PAY_STACK_API_KEY: Joi.string().required(),

  MAIL_GUN_API_KEY: Joi.string().required(),

  JWT_EXPIRY: Joi.string().default('24h').required(),

  BCRYPT_ROUND: Joi.string().default('10').required()
})
  .unknown()
  .required();

const { error, value: envVariables } = envVarsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

export default envVariables as EnvironmentInterface;
