export default async function errorsHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.throw(e);
  }
}
