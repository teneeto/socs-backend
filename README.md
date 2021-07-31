# Tensfer server

> Express REST API with JWT Authentication and support for sqlite, mysql, and postgresql using knex as database ORM and objection as knex Model Mapper

- authentication via [JWT](https://jwt.io/)
<!-- - routes mapping via [express-routes-mapper](https://github.com/aichbauer/express-routes-mapper) -->
- support for [sqlite](https://www.sqlite.org/), [mysql](https://www.mysql.com/), and [postgresql](https://www.postgresql.org/)
- environments for `development`, `testing`, and `production`
- linting via [eslint](https://github.com/eslint/eslint) and [tslint](https://palantir.github.io/tslint/)
- integration tests running with [Jest](https://github.com/facebook/jest)
- built with [npm scripts](#npm-scripts)
- example for User model and User controller, with jwt authentication, simply type `yarn` and `yarn dev`

## Table of Contents

- [Install & Use](#install-and-use)
- [Folder Structure](#folder-structure)
- [Controllers](#controllers)
  - [Create a Controller](#create-a-controller)
- [Models](#models)
  - [Create a Model](#create-a-model)
- [Policies](#policies)
  - [auth.policy](#authpolicy)
- [Services](#services)
- [Config](#config)
  - [Connection and Database](#connection-and-database)
- [Routes](#routes)
  - [Create Routes](#create-routes)
- [Test](#test)
  - [Setup](#setup)
- [npm Scripts](#npm-scripts)

## Install and Use

Start by cloning this repository

```sh
# HTTPS
$ git clone https://github.com/Tensfer-Tech/Tensfer-Backend
```

then

```sh
# cd into project root
$ yarn

# start the api
$ yarn dev
```

or

```sh
# cd into project root
$ npm i

# start the api
$ npm dev
```

Postgres is supported out of the box as it is the default.

## Folder Structure

This project has 10 main directories:

- config - for database, errors and environment variables.
- controllers - for api controllers.
- helpers - this is the directory for all helper methods you can as well call it your `utils` folder
- middlewares - this is the directory for all app api related [middlewares](http://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps)
- models - this is the directory for all database [models](https://vincit.github.io/objection.js/guide/models.html#examples)
- policies - this directory handles all api based policies example of this is the authentication and authorization policy.
- routes - this directory handles all api [routes](https://expressjs.com/en/guide/routing.html)
- services - this is the directory for all api based services example of this is an email, auth services etc.
- validations - this is the directory for all api request [validations](https://github.com/arb/celebrate)

## Controllers

### Create a Controller

Controllers in this project have a naming convention: `model_name.controller.ts` and uses class based pattern.
To use a model inside of your controller you have to require it.
We use [Objection](https://vincit.github.io/objection.js/) as ORM, if you want further information read the [Docs](https://vincit.github.io/objection.js/guide/query-examples.html).

Example Controller for signing up and in a **USER** operation:

```ts
import { Request, Response, NextFunction } from 'express';
import bcryptService from '@services/bcrypt.service';
import authService from '@services/auth.service';
import sendResponse from '@helpers/response';
import User from '@models/user.model';
import httpStatus from 'http-status';

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
      const { email } = req.body as UserInterface;

      const userExits = await User.query().where('email', email).first();

      if (userExits) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            sendResponse(
              httpStatus.BAD_REQUEST,
              'account already registered with us',
              null,
              { email: 'account already registered with us' }
            )
          );
      }

      const user = await User.query().insert({ ...req.body });

      return res
        .status(httpStatus.CREATED)
        .json(sendResponse(httpStatus.CREATED, 'success', user));
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
      const { email, password } = req.body as UserInterface;

      const user = await User.query().where('email', email).first();

      if (!user) {
        return res.status(httpStatus.BAD_REQUEST).json(
          sendResponse(httpStatus.NOT_FOUND, 'User does not exist', null, {
            error: 'User does not exist'
          })
        );
      }

      const correctPassword = bcryptService.comparePassword(
        password,
        user.password
      );

      if (!correctPassword) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'invalid email or password',
            null,
            { error: 'invalid email or password' }
          )
        );
      }

      const { role, id: sub } = user;
      const token = await authService.issue({ role, sub, iat: Date.now() });

      return res
        .status(httpStatus.OK)
        .json(sendResponse(httpStatus.OK, 'success', user, null, token));
    } catch (error) {
      next(error);
    }
  }
}
```

## Models

### Create a Model

Models in this project have a naming convention: `model_name.model.ts` and uses [Objection](https://vincit.github.io/objection.js/) to define our Models, if you want further information read the [Docs](https://vincit.github.io/objection.js/guide/models.html).

Example User Model:

```ts
import database from '@config/database';
import objectionGuid from 'objection-guid';
import bcryptService from '@services/bcrypt.service';
import { Model, mixin, ModelOptions, QueryContext } from 'objection';

const convertModelIdToGuid = objectionGuid();

/**
 *
 * @class
 * @classdesc Class representing the User database model
 * @extends Model
 *
 */

// Give the knex database instance to objection.
Model.knex(database);

export default class User extends mixin(Model, [convertModelIdToGuid]) {
  dob?: Date;
  id!: string;
  role!: Role;
  city?: string;
  email!: string;
  state?: string;
  avatar?: string;
  created_at!: Date;
  updated_at!: Date;
  last_name!: string;
  password!: string;
  first_name!: string;
  is_verified!: string;

  // Table name is the only required property.
  static tableName = 'user';

  async $beforeInsert(context: QueryContext) {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.
    await super.$beforeInsert(context);
    this.password = bcryptService.hashPassword(this.password);
  }

  async $beforeUpdate(options: ModelOptions, context: QueryContext) {
    // If you extend existing methods like this one, always remember to call the
    // super implementation. Check the documentation to see if the function can be
    // async and prepare for that also.

    await super.$beforeUpdate(options, context);

    // Only run this block if user updates are password update
    if (this.password) {
      this.password = bcryptService.hashPassword(this.password);
    }
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: [
      'role',
      'email',
      'last_name',
      'password',
      'first_name',
      'is_verified'
    ],

    properties: {
      id: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      avatar: { type: 'string' },
      password: { type: 'string' },
      is_verified: { type: 'boolean' },
      dob: { type: 'string', format: 'date' },
      email: { type: 'string', format: 'email' },
      role: { type: 'string', enum: [Role.ADMIN, Role.CUSTOMER] },
      last_name: { type: 'string', minLength: 1, maxLength: 255 },
      first_name: { type: 'string', minLength: 1, maxLength: 255 }
    }
  };
}
```

## Policies

Policies are middleware functions that can run before hitting a specific or more specified route(s).

Example policy:

> Note: This Middleware only allows the user to the next route if the user is authorized.

## auth.policy

The `auth.policy` checks wether a `JSON Web Token` ([further information](https://jwt.io/)) is send in the header of an request as `Authorization: Bearer [JSON Web Token]` or inside of the body of an request as `token: [JSON Web Token]`.
The policy runs default on all api routes that are are `private`.

```ts
import { Request, Response, NextFunction } from 'express';
import authService from '@services/auth.service';
import sendResponse from '@helpers/response';
import httpStatus from 'http-status';

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
        sendResponse(httpStatus.UNAUTHORIZED, 'Invalid Token', null, {
          error: 'Invalid Token'
        })
      );
    }
  }

  return res.status(httpStatus.UNAUTHORIZED).json(
    sendResponse(httpStatus.UNAUTHORIZED, 'No Token found', null, {
      error: 'No Authorization found'
    })
  );
}
```

To use this policy on all routes that only authorized users are allowed:

user.routes.ts

```ts
import { Router } from 'express';
import authToken from '@policies/auth.policy';
import userCtrl from '@controllers/user.controller';

const router = Router();

/**
 * Router layer representing the Authorization check for authorized users
 * @function authToken
 * @description Authenticated routes only accessible by authorized users
 */

router.use(authToken);
router.route('/').get(userCtrl.transactionHistory);

export default router;
```

## Services

Services are little useful snippets, or calls to another API that are not the main focus of your API.

Example service:

encrypting and decrypting user password on signup and signin:

```ts
import bcrypt from 'bcrypt';
import config from '@config/index';

interface BcryptServiceInterface {
  hashPassword: (password: string) => string;
  comparePassword: (password: string, hash: string) => boolean;
}

/**
 * User password service builder factory
 * @function bcryptService
 * @description user password encryption and decryption service
 * @exports BcryptServiceInterface
 */

function bcryptService(): BcryptServiceInterface {
  /**
   * @function hashPassword
   * @param {string} password - user registration password
   * @returns {string} Returns the signed encrypted user password
   */
  const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(Number(config.BCRYPT_ROUND));
    return bcrypt.hashSync(password, salt);
  };

  /**
   * @function comparePassword
   * @param {string} password - user registered password
   * @param {string} hash - user encrypted registration password
   * @returns {boolean} Returns boolean if the both the registration password and encrypted password matches after decrypting it
   */
  const comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };

  return { hashPassword, comparePassword };
}

export default bcryptService();
```

## Config

Holds all the server configurations.

## Connection and Database

> Note: if you use msql make sure mysql server is running on the machine

> Note: if you use postgres make sure postgres server is running on the machine

This two files are the way to establish a connection to a database.

You only need to touch connection.js, default for `development` is sqlite, but it is easy as typing `mysql` or `postgres` to switch to another db.

> Note: to run a mysql db install these package with: `yarn add mysql2` or `npm i mysql2 -S`

> Note: to run a postgres db run these package with: `yarn add pg pg-hstore` or `npm i -S pg pg-hstore`

Now simple configure the keys with your credentials.

```ts
const databaseConfig: { [key in typeof config.NODE_ENV]: object } = {
  development: {
    client: 'pg',
    debug: config.DEBUG_DATA_BASE,
    dialect: config.DATA_BASE_DIALECT,
    connection: {
      host: config.DATA_BASE_HOST,
      user: config.DATA_BASE_USER,
      database: config.DATA_BASE_NAME,
      password: config.DATA_BASE_PASSWORD
    }
  },
  test: {
    client: 'sqlite3',
    debug: config.DEBUG_DATA_BASE,
    dialect: config.DATA_BASE_DIALECT,
    connection: {
      host: config.DATA_BASE_HOST,
      user: config.DATA_BASE_USER,
      database: config.DATA_BASE_NAME,
      password: config.DATA_BASE_PASSWORD,
      filename: '../../db/database.sqlite'
    }
  },
  production: {
    client: 'pg',
    debug: config.DEBUG_DATA_BASE,
    dialect: config.DATA_BASE_DIALECT,
    connection: {
      host: config.DATA_BASE_HOST,
      user: config.DATA_BASE_USER,
      database: config.DATA_BASE_NAME,
      password: config.DATA_BASE_PASSWORD
    }
  }
};
```

To not configure the production code.

To start the DB, add the credentials for your work environment `production | development | testing`. on a `.env` file.

## Routes

Here you define all your routes for your api. It doesn't matter how you structure them. By default they are mapped on `authenticated routes` and `non-authenticated routes`. You can define as much routes files as you want e.g. for every model or for specific use cases, e.g. normal user and admins.

## Create Routes

For further information read the [docs](https://github.com/aichbauer/express-routes-mapper/blob/master/README.md) of express-routes-mapper.

Example for User Model:

> Note: Only supported Methods are **POST**, **GET**, **PUT**, and **DELETE**.

auth.route.ts

```ts
import { Router } from 'express';
import { celebrate as validate } from 'celebrate';
import authCtrl from '@controllers/auth.controller';
import authValidation from '@validations/auth.validation';

const router = Router();

router
  .route('/signup')
  .post(
    [validate(authValidation.signupUser, { abortEarly: false })],
    authCtrl.signup
  );

router
  .route('/signin')
  .post(
    [validate(authValidation.signinUser, { abortEarly: false })],
    authCtrl.signin
  );

export default router;
```

To use these routes in the application, require them in the router index.ts and export the base router.

```ts
/**************************************************************************************** *
 * ******************************                    ************************************ *
 * ******************************   ALL APP ROUTES   ************************************ *
 * ******************************                    ************************************ *
 * ************************************************************************************** */

import { Request, Response, Router } from 'express';

import authRoute from '@routes/auth.routes';
import userRoute from '@routes/user.routes';

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (_req: Request, res: Response) =>
  res.send({ check: 'tensfer server started ok' })
);

// mount auth routes
router.use('/auth', authRoute);

// mount users routes
router.use('/users', userRoute);

export default router;
```

index.ts

```ts
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import logger from 'morgan';
import express from 'express';
import routes from '@routes/index';
import config from '@config/index';
import error from '@config/errors';
import compress from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

// express application
const app = express();
const server = new http.Server(app);

// start and connect to database
import '@config/database';

// secure apps by setting various HTTP headers
app.use(
  helmet({ dnsPrefetchControl: false, frameguard: false, ieNoOpen: false })
);

// compress request data for easy transport
app.use(compress());
app.use(methodOverride());

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

// parse body params and attach them to res.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable detailed API logging in dev env
if (config.NODE_ENV === 'development') app.use(logger('dev'));

// all API versions are marked here within the app
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

if (
  config.NODE_ENV !== 'production' &&
  config.NODE_ENV !== 'development' &&
  config.NODE_ENV !== 'test'
) {
  // eslint-disable-next-line no-console
  console.error(
    `NODE_NODE_ENV is set to ${config.NODE_ENV}, but only production and development are valid.`
  );
  process.exit(1);
}

// opens a port if the NODE_ENV environment is not test
if (config.NODE_ENV !== 'test') {
  server.listen(config.PORT, () => {
    console.info(`server started on port ${config.PORT} (${config.NODE_ENV})`); // eslint-disable-line no-console
  });
}
```

## Test

All test for this project uses [Jest](https://github.com/facebook/jest) and [supertest](https://github.com/visionmedia/superagent) for integration testing. So read their docs on further information.

## LICENSE

MIT © Tensfer Invest
