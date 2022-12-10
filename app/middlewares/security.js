const config = require('config');

module.exports = {
  async ApiKeysValidator(ctx, next) {
    const apiKey = ctx.request.query.apiKey || ctx.headers['x-secure-hash'];
    const isValid = Boolean(apiKey === config.server.apiKey);
    if (isValid) {
      await next();
    } else {
      ctx.throw(403);
    }
  },
};
