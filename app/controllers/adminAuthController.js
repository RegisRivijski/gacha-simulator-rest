import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';

import config from '../../config/default.js';

import LoggerService from '../classes/ActionServices/LoggerService.js';
import AdminsModel from '../models/genshinImpactTgBot/admins.js';

export async function loginAction(ctx, next) {
  const { login, password } = ctx.request.body;

  ctx.assert(login && password, 400, 'Login and password required');

  const adminData = await AdminsModel.findOne({ login })
    .catch((e) => {
      LoggerService.error('adminController getAdmin AdminsModel findOne:', e);
      ctx.throw(500);
    });

  ctx.assert(adminData?.login, 404, 'Admin did not exist');

  const match = await bcrypt.compare(password, adminData.hash)
    .catch((e) => {
      LoggerService.error('adminController getAdmin bcrypt:', e);
      ctx.throw(500);
    });

  ctx.assert(match, 403);

  let jwt = '';
  try {
    jwt = jsonWebToken.sign(adminData, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      algorithm: config.jwt.algorithm,
    });
  } catch (e) {
    LoggerService.error('adminController getAdmin jsonWebToken sign:', e);
  }

  ctx.session.user = jwt;

  ctx.body = adminData;
  ctx.status = 200;
  await next();
}

export async function exit(ctx, next) {
  delete ctx.session.user;

  ctx.status = 200;

  await next();
}

export async function me(ctx, next) {
  if (ctx.session.user) {
    ctx.body = ctx.session.user;
    ctx.status = 200;
  } else {
    ctx.throw(403);
  }
  await next();
}
