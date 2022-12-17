import * as documentsHelper from '../helpers/documentsHelper.js';

import UsersModel from '../models/users.js';
import AdminsModel from '../models/admins.js';

export async function getAdmin(ctx, next) {
  const { chatId } = ctx.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const adminData = await AdminsModel.findOne({ chatId })
    .catch((e) => {
      console.error('[ERROR] adminController getAdmin AdminsModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(adminData.chatId, 404, 'Admin not found.');

  ctx.body = adminData;
  ctx.status = 200;
  await next();
}

export async function updateAdmin(ctx, next) {
  const { chatId } = ctx.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { fields } = ctx.request.body;
  ctx.assert(fields, 400, 'fields are required');

  let adminData = await AdminsModel.findOne({ chatId })
    .catch((e) => {
      console.error('[ERROR] adminController updateAdmin AdminsModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(adminData.chatId, 404, 'Admin not found.');

  adminData = documentsHelper.update(adminData, fields);

  adminData = await adminData.save()
    .catch((e) => {
      console.error('[ERROR] adminController updateAdmin AdminsModel adminData save:', e.message);
      ctx.throw(500);
    });

  ctx.body = adminData;
  ctx.status = 200;
  await next();
}

export async function addAdmin(ctx, next) {
  const { chatId } = ctx.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { fields, adminType } = ctx.request.body;
  ctx.assert(fields, 400, 'fields are required');

  let adminData = await AdminsModel.findOne({ chatId })
    .catch((e) => {
      console.error('[ERROR] adminController addAdmin AdminsModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(adminData.chatId, 404, 'Admin not found.');

  adminData = new UsersModel({
    chatId,
    adminType,
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
