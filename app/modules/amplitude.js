import Amplitude from '@amplitude/node';

import config from '../../config/default.js';

const client = Amplitude.init(config.analytics.Amplitude.key);

export default {
  log(data) {
    return client.logEvent(data);
  },
};
