import bcrypt from 'bcrypt';

import LoggerService from '../classes/ActionServices/LoggerService.js';

import AdminsModel from '../models/genshinImpactTgBot/admins.js';

import * as securityHelper from '../helpers/securityHelper.js';

export async function loginAction(ctx, next) {
  const { login, password } = ctx.request.body;
  ctx.assert(login && password, 400, 'Login and password required');

  const adminData = await AdminsModel.findOne({ login })
    .catch((e) => {
      LoggerService.error('adminAuthController loginAction AdminsModel findOne:', e);
      ctx.throw(500);
    });
  ctx.assert(adminData?.login, 404, 'Admin did not exist');

  const match = await bcrypt.compare(password, adminData.hash)
    .catch((e) => {
      LoggerService.error('adminAuthController loginAction bcrypt:', e);
      ctx.throw(500);
    });
  ctx.assert(match, 403);

  let jwt = '';
  try {
    jwt = await securityHelper.getToken({
      login: adminData.login,
      adminType: adminData.adminType,
    });
  } catch (e) {
    LoggerService.error('adminAuthController loginAction securityHelper getToken:', e);
    ctx.throw(500);
  }

  ctx.body = {
    jwt,
    login: adminData?.login,
    adminType: adminData?.adminType,
  };

  ctx.status = 200;
  await next();
}

export async function exit(ctx, next) {
  const { token, session } = ctx.state;

  try {
    const ttl = session.exp - Math.floor(new Date().getTime() / 1000);
    await securityHelper.addTokenToBlackList(token, ttl);
  } catch (e) {
    LoggerService.error('adminAuthController exit securityHelper addTokenToBlackList:', e);
    ctx.throw(500);
  }

  ctx.body = {
    message: 'Token added to black list successfully',
  };
  ctx.status = 200;
  await next();
}

export async function me(ctx, next) {
  const { login } = ctx.state.session;
  ctx.assert(login, 400, 'Invalid jwt token');

  const adminData = await AdminsModel.findOne({ login })
    .catch((e) => {
      LoggerService.error('adminAuthController loginAction AdminsModel findOne:', e);
      ctx.throw(500);
    });
  ctx.assert(adminData?.login, 404, 'Admin did not exist');

  ctx.body = {
    login: adminData.login,
    adminType: adminData.adminType,
  };
  ctx.status = 200;
  await next();
}
