import config from '../../config/default.js';

export async function ApiKeysValidator(ctx, next) {
  const apiKey = ctx.request.query.apiKey || ctx.headers['x-secure-hash'];
  if (apiKey === config.server.apiKey) {
    await next();
  } else {
    ctx.throw(403);
  }
}
