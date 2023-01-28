import Koa from 'koa';
import http from 'http';
import config from '../config/default.js';

import { privateRouter, publicRouter } from './routes/index.js';
import mongooseConnector from './modules/mongoose.js';
import errorsHandler from './middlewares/errorsHandler.js';

export default function main() {
  const app = new Koa();

  app.use(errorsHandler);
  app.use(privateRouter.routes());
  app.use(privateRouter.allowedMethods());

  app.use(publicRouter.routes());
  app.use(publicRouter.allowedMethods());

  mongooseConnector();

  const server = http.createServer(app.callback());

  server.listen(config.server.port, async () => {
    console.table({
      Application: config.application.name,
      Version: config.application.version,
      Port: config.server.port,
    });
  });
}
