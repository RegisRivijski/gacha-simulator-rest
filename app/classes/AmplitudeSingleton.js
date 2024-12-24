import Amplitude from '@amplitude/node';

import config from '../../config/default.js';

const client = Amplitude.init(config.analytics.Amplitude.key);

export default client;
