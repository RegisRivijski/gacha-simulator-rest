export async function ApiKeysValidator(ctx, next) {
  const apiKey = ctx.request.query.apiKey || ctx.headers['x-secure-hash'];
  const isValid = Boolean(apiKey === global.CONFIG.server.apiKey);
  if (isValid) {
    await next();
  } else {
    ctx.throw(403);
  }
}
