const AdminsModel = require('../models/admins');
const documentsHelper = require('../helpers/documentsHelper');
const UsersModel = require("../models/users");

module.exports = {
  async getAdmin(ctx, next) {
    const { chatId } = ctx.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const adminData = await AdminsModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] adminController getAdmin AdminsModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(adminData.chatId, 404, 'Admin not found.');

    ctx.body = adminData;
    ctx.statuc = 200;
    await next();
  },

  async updateAdmin(ctx, next) {
    const { chatId } = ctx.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const { fields } = ctx.body;
    ctx.assert(fields, 400, 'fields are required');

    let adminData = await AdminsModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] adminController updateAdmin AdminsModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(adminData.chatId, 404, 'Admin not found.');

    adminData = documentsHelper.update(adminData, fields);

    adminData = await adminData.save()
      .catch((e) => {
        console.error('[ERROR] adminController updateAdmin AdminsModel adminData save:', e.message);
        ctx.throw(500, e.message);
      });

    ctx.body = adminData;
    ctx.status = 200;
    await next();
  },

  async addAdmin(ctx, next) {
    const { chatId } = ctx.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const { fields } = ctx.body;
    ctx.assert(fields, 400, 'fields are required');

    let adminData = await AdminsModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] adminController addAdmin AdminsModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(adminData.chatId, 404, 'Admin not found.');

    const {
      adminType,
    } = ctx.request.body;

    adminData = new UsersModel({
      chatId,
      adminType,
    });

    adminData = await adminData.save()
      .catch((e) => {
        console.error('[ERROR] adminController addAdmin AdminsModel adminData save:', e.message);
        ctx.throw(500, e.message);
      });

    ctx.body = adminData;
    ctx.status = 200;
    await next();
  },
};
