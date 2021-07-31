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


export default app;