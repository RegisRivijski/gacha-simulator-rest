const Koa = require('koa');
const http = require('http');
const config = require('config');
const routes = require('./routes/index');

const app = new Koa();
const Router = routes.Router();

app.use(Router.routes());
app.use(Router.allowedMethods());

const server = http.createServer(app.callback());

server.listen(config.server.port, async () => {
  // eslint-disable-next-line no-console
  console.table({
    Application: config.application.name,
    Version: config.application.version,
    Port: config.server.port,
  });
});
