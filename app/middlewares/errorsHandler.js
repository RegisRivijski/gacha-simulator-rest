import LoggerService from '../classes/ActionServices/LoggerService.js';

export default async function errorsHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    LoggerService.fatal('UNHANDLED', e);

    ctx.status = e.status || 500;
    ctx.body = {
      error: {
        message: e.message,
        status: ctx.status,
      },
    };
  }
}
