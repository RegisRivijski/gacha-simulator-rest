import Redis from 'ioredis';

import LoggerService from '../ActionServices/LoggerService.js';

import config from '../../../config/default.js';

const redisClient = new Redis(config.db.redis.url);

redisClient.on('connect', () => {
  LoggerService.info('Redis successfully connected');
});

redisClient.on('error', (err) => {
  LoggerService.error('Redis connection error', err);
});

export default redisClient;
