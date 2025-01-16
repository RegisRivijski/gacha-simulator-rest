import Sentry from '@sentry/node';
import config from '../../../config/default.js';

Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

export default Sentry;
