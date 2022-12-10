const config = require('config');

module.exports = {
  async ApiKeysValidator(ctx, next) {
    const apiKey = ctx.request.params.apiKey || ctx.headers['x-secure-hash'];
    console.log(ctx.request);
    const isValid = Boolean(apiKey === config.server.apiKey);
    if (isValid) {
      await next();
    } else {
      ctx.throw(403);
    }
  },
};
