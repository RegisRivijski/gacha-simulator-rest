const _ = require('lodash');
const ejs = require('ejs');

const UsersModel = require('../models/users');
const HistoryModel = require('../models/histories');
const ItemsModel = require('../models/items');

const documentsHelper = require('../helpers/documentsHelper');
const translatesHelper = require('../helpers/translatesHelper');
const bannersHelper = require('../helpers/bannersHelper');
const itemsHelper = require('../helpers/itemsHelper');
const userHelper = require('../helpers/usersHelper');
const historyHelper = require('../helpers/historyHelper');
const inventoryHelper = require('../helpers/inventoryHelper');

const templates = require('../modules/templates');
const minify = require('../modules/minify');

const {
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
  EVENT_BANNER_CATEGORY_NAME,
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
  USERS_HISTORY_ACTION_WISH,
  USERS_HISTORY_ACTION_PRIMOGEMS,
  USERS_HISTORY_LOGS_PER_PAGE,
} = require('../constants/index');

module.exports = {
  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
  async getUsers(ctx, next) {
    ctx.body = await UsersModel.find({})
      .catch((e) => {
        console.error('[ERROR] userController getUsers UsersModel find:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.status = 200;
    await next();
  },

  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
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

  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
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

  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
  async getTgBotProfile(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const {
      currentBannerIsValid,
      currentBanner,
    } = userHelper.validateCurrentBanner(userData);

    if (!currentBannerIsValid) {
      userData.currentBanner = currentBanner;
      userData.save()
        .catch((e) => {
          console.error('[ERROR] userController getProfile UserModel userData save:', e.message);
        });
    }

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    const activeEventBanners = bannersHelper.getActiveEventBanners();
    const activeUniversalBanners = bannersHelper.getActiveUniversalBanners();

    const currentBannerData = bannersHelper.getBannerData(currentBanner);
    const currentBannerChances = bannersHelper.calculateDropChances({
      type: currentBannerData.type,
      fourStar: _.result(userData, [currentBannerData.type, 'fourStar'], 0),
      fiveStar: _.result(userData, [currentBannerData.type, 'fiveStar'], 0),
    });

    let messageTemplate = ejs.render(templates.tgBot.profile, {
      _,
      $t,
      itemsHelper,
      userData,
      activeEventBanners,
      activeUniversalBanners,
      currentBannerData,
      currentBannerChances,
      STANDARD_BANNER_TYPE_NAME,
      CHARACTERS_BANNER_TYPE_NAME,
      WEAPONS_BANNER_TYPE_NAME,
      EVENT_BANNER_CATEGORY_NAME,
      TYPE_CHARACTERS_NAME,
      TYPE_WEAPONS_NAME,
    });

    messageTemplate = minify.minifyTgBot(messageTemplate);

    ctx.body = {
      userData,
      messageTemplate,
    };
    ctx.status = 200;
    await next();
  },

  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
  async getTgBotHistory(ctx, next) {
    const {
      chatId,
    } = ctx.request.params;
    let {
      page = 0,
    } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');
    page = Number(page);

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getHistory UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    const [
      historyData,
      historyLogsCount,
    ] = await Promise.all([
      // historyData
      HistoryModel.find({ chatId }, null, {
        skip: page * USERS_HISTORY_LOGS_PER_PAGE,
        limit: USERS_HISTORY_LOGS_PER_PAGE,
        sort: {
          created: -1,
        },
      })
        .then((data) => historyHelper.addingStaticData(data, languageCode))
        .catch((e) => {
          console.error('[ERROR] userController getHistory HistoryModel find:', e.message);
          ctx.throw(500, e.message);
        }),
      // historyLogsCount
      HistoryModel.count({ chatId })
        .catch((e) => {
          console.error('[ERROR] userController getHistory HistoryModel count:', e.message);
          return 0;
        }),
    ]);

    const pagesCount = Math.ceil(historyLogsCount / USERS_HISTORY_LOGS_PER_PAGE);

    let messageTemplate = ejs.render(templates.tgBot.history, {
      $t,
      userData,
      historyData,
      page,
      pagesCount,
      USERS_HISTORY_ACTION_WISH,
      USERS_HISTORY_ACTION_PRIMOGEMS,
    });

    messageTemplate = minify.minifyTgBot(messageTemplate);

    ctx.body = {
      userData,
      messageTemplate,
    };
    ctx.status = 200;
    await next();
  },

  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
  async getTgBotInventory(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getInventory UsersModel findOne:', e.message);
        ctx.throw(500, e.message);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    const inventoryData = await ItemsModel.find({ chatId })
      .then((itemsData) => inventoryHelper.makingInventoryTree(itemsData, languageCode))
      .catch((e) => {
        console.error('[ERROR] userController getInventory ItemsModel find:', e.message);
        ctx.throw(500, e.message);
      });

    let messageTemplate = ejs.render(templates.tgBot.inventory, {
      $t,
      userData,
      inventoryData,
    });

    messageTemplate = minify.minifyTgBot(messageTemplate);

    ctx.body = {
      userData,
      messageTemplate,
    };
    ctx.status = 200;
    await next();
  },
};
