import pino from 'pino';

import config from '../../../config/default.js';

const logger = pino({
  name: config.application.name,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default logger;
