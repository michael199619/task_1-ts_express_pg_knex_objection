import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Model } from 'objection';
import { router } from './routes';
import database from './config/knex';
import swaggerDocument from '../swagger.json';

const { name, environment } = config;
const app: express.Application = express();

Model.knex(database);

app.locals.name = name;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (environment === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerDocument)));
}

app.use('/', router);

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      message: err.error.toString()
    });
  } else {
    next();
  }
});

export default app;
