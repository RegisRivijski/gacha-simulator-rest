import { init, OfflineRetryHandler } from '@amplitude/node';

import config from '../../config/default.js';

const apiKey = config.analytics.Amplitude.key;

const client = init(apiKey, {
  retryClass: new OfflineRetryHandler(apiKey),
});

export default client;
