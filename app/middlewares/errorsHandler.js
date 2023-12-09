import Sentry from '@sentry/node';

import config from '../../config/default.js';

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

export default async function errorsHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    Sentry.captureException(e);

    console.error('Fatal error!');
    console.error(' =>', e.message);

    ctx.status = e.status || 500;
    ctx.body = {
      error: {
        message: e.message,
        status: ctx.status,
      },
    };
  }
}
