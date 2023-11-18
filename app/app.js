import Koa from 'koa';
import http from 'http';
import session from 'koa-session';

import config from '../config/default.js';

import { privateRouter, publicRouter } from './routes/index.js';
import errorsHandler from './middlewares/errorsHandler.js';

export default function main() {
  const app = new Koa();

  app.use(errorsHandler);
  app.use(session(config.session, app));
  app.use(privateRouter.routes());
  app.use(privateRouter.allowedMethods());

  app.use(publicRouter.routes());
  app.use(publicRouter.allowedMethods());

  const server = http.createServer(app.callback());

  server.listen(config.server.port, async () => {
    console.table({
      Application: config.application.name,
      Version: config.application.version,
      Port: config.server.port,
    });
  });
}
