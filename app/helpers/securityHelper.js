import jsonWebToken from 'jsonwebtoken';

import RedisSingleton from '../classes/ServiceSingletons/RedisSingleton.js';

import config from '../../config/default.js';

const redis = RedisSingleton.getRedisClient();

export function getToken(data) {
  return new Promise((resolve, reject) => {
    jsonWebToken.sign(data, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      algorithm: config.jwt.algorithm,
    }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jsonWebToken.verify(token, config.jwt.secret, {
      algorithm: config.jwt.algorithm,
    }, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export function addTokenToBlackList(token, ttl) {
  return redis.set(`bl_${token}`, true, 'EX', ttl);
}

export function getTokenFromBlackList(token) {
  return redis.get(`bl_${token}`);
}
