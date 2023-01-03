export async function about(ctx, next) {
  ctx.body = global.CONFIG.application;
  ctx.status = 200;
  await next();
}

export async function ping(ctx, next) {
  ctx.body = 'Pong!';
  ctx.status = 200;
  await next();
}

export async function memory(ctx, next) {
  ctx.body = process.memoryUsage();
  ctx.status = 200;
  await next();
}
