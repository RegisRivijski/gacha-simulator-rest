export default async function errorsHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    console.error('[FATAL ERROR]', e);
    ctx.throw(e);
  }
}
