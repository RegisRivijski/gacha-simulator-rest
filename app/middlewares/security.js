import config from '../../config/default.js';

import LoggerService from '../classes/ActionServices/LoggerService.js';

import * as securityHelper from '../helpers/securityHelper.js';

export async function ApiKeysValidator(ctx, next) {
  const apiKey = ctx.request.query.apiKey || ctx.headers['x-secure-hash'];
  if (apiKey === config.server.apiKey) {
    await next();
  } else {
    ctx.throw(403);
  }
}

export async function session(ctx, next) {
  const token = ctx.request.headers.authorization?.replace('Bearer ', '');

  if (!token) ctx.throw(403);

  try {
    const isBlackToken = await securityHelper.getTokenFromBlackList(token);
    if (isBlackToken) {
      ctx.throw(403);
    }

    ctx.state.session = await securityHelper.verifyToken(token);
    ctx.state.token = token;
    await next();
  } catch (e) {
    LoggerService.error('User is not valid', e);
    ctx.throw(403);
  }
}
