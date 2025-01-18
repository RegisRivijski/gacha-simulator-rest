import Koa from 'koa';
import http from 'http';

import config from '../config/default.js';

import LoggerService from './classes/ActionServices/LoggerService.js';

import { privateRouter, publicRouter } from './routes/index.js';
import errorsHandler from './middlewares/errorsHandler.js';

export default function main() {
  const app = new Koa();

  app.use(errorsHandler);
  app.use(privateRouter.routes());
  app.use(privateRouter.allowedMethods());

  app.use(publicRouter.routes());
  app.use(publicRouter.allowedMethods());

  const server = http.createServer(app.callback());

  server.listen(config.server.port, async () => {
    LoggerService.info('Application started!');
    LoggerService.info(`Name: ${config.application.name}`);
    LoggerService.info(`Version: ${config.application.version}`);
    LoggerService.info(`Port: ${config.server.port}`);
  });
}
