import bcrypt from 'bcrypt';

import config from '../../config/default.js';

import AdminsModel from '../models/genshinImpactTgBot/admins.js';

export async function addAdmin(ctx, next) {
  const { fields, login, password } = ctx.request.body;

  ctx.assert(fields, 400, 'fields are required');
  ctx.assert(login && password, 'Login and password required');

  let hash = '';
  try {
    const salt = bcrypt.genSaltSync(config.bcrypt.saltRounds);
    hash = bcrypt.hashSync(password, salt);
  } catch (e) {
    console.error('[ERROR] app/controllers/adminController.js addAdmin genSaltSync hashSync:', e.message);
    ctx.throw(500);
  }

  let adminData = new AdminsModel({
    login,
    hash,
    ...fields,
  });

  adminData = await adminData.save()
    .catch((e) => {
      console.error('[ERROR] adminController addAdmin AdminsModel adminData save:', e.message);
      ctx.throw(500);
    });

  ctx.body = adminData;
  ctx.status = 200;
  await next();
}
