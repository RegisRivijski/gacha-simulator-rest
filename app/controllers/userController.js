const UsersModel = require('../models/users');
const HistoryModel = require('../models/histories');
const ItemsModel = require('../models/items');

const documentsHelper = require('../helpers/documentsHelper');

const templatesModule = require('../modules/templates');

module.exports = {
  async getUsers(ctx, next) {
    ctx.body = await UsersModel.find({})
      .catch((e) => {
        console.error('[ERROR] userController getUsers UsersModel find:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.status = 200;
    await next();
  },

  async getUser(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getUser UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    ctx.body = userData;
    ctx.status = 200;
    await next();
  },

  async updateUser(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const { fields } = ctx.body;
    ctx.assert(fields, 400, 'fields are required');

    let userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController changeUser UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    userData = documentsHelper.update(userData, fields);

    userData = await userData.save()
      .catch((e) => {
        console.error('[ERROR] userController changeUser UsersModel userData save:', e.message);
        ctx.throw(500, e.message);
      });

    ctx.body = userData;
    ctx.status = 200;
    await next();
  },

  async addUser(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    let userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getUser UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(!userData?.chatId, 400, 'User is already created.');

    const {
      firstName,
      lastName,
      username,
      languageCode,
    } = ctx.request.body;

    userData = new UsersModel({
      chatId,
      firstName,
      lastName: lastName || '',
      username: username || '',
      languageCode: languageCode || '',
    });

    userData = await userData.save()
      .catch((e) => {
        console.error('[ERROR] userController addUser UsersModel userData save:', e.message);
        ctx.throw(500, e.message);
      });

    ctx.body = userData;
    ctx.status = 200;
    await next();
  },

  async getProfile(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const template = templatesModule.profile({ userData });

    ctx.body = {
      userData,
      template,
    };
    ctx.status = 200;
    await next();
  },

  async getHistory(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getHistory UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const historyData = await HistoryModel.find({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getHistory HistoryModel find:', e.message);
        ctx.throw(500, e.message);
      });

    const template = templatesModule.history({ userData, historyData });

    ctx.body = {
      userData,
      historyData,
      template,
    };
    ctx.status = 200;
    await next();
  },

  async getInventory(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getInventory UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const itemsData = await ItemsModel.find({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getInventory ItemsModel find:', e.message);
        ctx.throw(500, e.message);
      });

    const template = templatesModule.inventory({ userData, itemsData });

    ctx.body = {
      userData,
      itemsData,
      template,
    };
    ctx.status = 200;
    await next();
  },
};
