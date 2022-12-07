const Koa = require('koa');
const http = require('http');
const config = require('config');
const routes = require('./routes/index');

const mongoose = require('./modules/mongoose');

const app = new Koa();
const Router = routes.Router();

app.use(Router.routes());
app.use(Router.allowedMethods());

mongoose.connect();

const server = http.createServer(app.callback());

server.listen(config.server.port, async () => {
  console.table({
    Application: config.application.name,
    Version: config.application.version,
    Port: config.server.port,
  });
});
