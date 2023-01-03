import Koa from 'koa';
import http from 'http';

import { privateRouter, publicRouter } from './routes/index.js';
import mongooseConnector from './modules/mongoose.js';

export default function main() {
  const app = new Koa();

  app.use(privateRouter.routes());
  app.use(privateRouter.allowedMethods());

  app.use(publicRouter.routes());
  app.use(publicRouter.allowedMethods());

  mongooseConnector();

  const server = http.createServer(app.callback());

  server.listen(global.CONFIG.server.port, async () => {
    console.table({
      Application: global.CONFIG.application.name,
      Version: global.CONFIG.application.version,
      Port: global.CONFIG.server.port,
    });
  });
}
