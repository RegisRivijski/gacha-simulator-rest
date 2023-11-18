import bcrypt from 'bcrypt';
import AdminsModel from '../models/genshinImpactTgBot/admins.js';

export async function loginAction(ctx, next) {
  const { login, password } = ctx.request.body;

  ctx.assert(login && password, 400, 'Login and password required');

  const adminData = await AdminsModel.findOne({ login })
    .catch((e) => {
      console.error('[ERROR] adminController getAdmin AdminsModel findOne:', e.message);
      ctx.throw(500);
    });

  ctx.assert(adminData?.login, 404, 'Admin did not exist');

  const match = await bcrypt.compare(password, adminData.hash)
    .catch((e) => {
      console.error('[ERROR]', e.message);
      ctx.throw(500);
    });

  ctx.assert(match, 403);

  ctx.session.user = adminData;

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
