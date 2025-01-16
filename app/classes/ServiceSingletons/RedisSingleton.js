import Redis from 'ioredis';

import LoggerService from '../ActionServices/LoggerService.js';

import config from '../../../config/default.js';

class RedisSingleton {
  constructor() {
    this.redisClient = new Redis(config.db.redis.url);

    this.redisClient.on('connect', () => {
      LoggerService.info('Redis successfully connected');
    });

    this.redisClient.on('error', (err) => {
      LoggerService.error('Redis connection error', err);
    });
  }

  getRedisClient() {
    return this.redisClient;
  }
}

const redis = new RedisSingleton();

export default redis;
