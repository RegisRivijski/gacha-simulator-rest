import Koa from 'koa';
import http from 'http';
import config from '../config/default.js';

import { router, adminRouter } from './routes/index.js';
import mongooseConnector from './modules/mongoose.js';

export default function main() {
  const app = new Koa();

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(adminRouter.routes());
  app.use(adminRouter.allowedMethods());

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
