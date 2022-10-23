const config = require('config');

module.exports = {
  async about(ctx, next) {
    ctx.body = config.application;
    ctx.status = 200;
    await next();
  },

  async ping(ctx, next) {
    ctx.body = 'Pong!';
    ctx.status = 200;
    await next();
  },

  async memory(ctx, next) {
    ctx.body = process.memoryUsage();
    ctx.status = 200;
    await next();
  },
};
