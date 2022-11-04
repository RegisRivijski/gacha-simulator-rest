const _ = require('lodash');
const ejs = require('ejs');

const UsersModel = require('../models/users');
const HistoryModel = require('../models/histories');
const ItemsModel = require('../models/items');

const translatesHelper = require('../helpers/translatesHelper');
const userHelper = require('../helpers/usersHelper');
const wishHelper = require('../helpers/wishHelper');

const templates = require('../modules/templates');
const minify = require('../modules/minify');

module.exports = {
  /**
   *
   * @param ctx
   * @param next
   * @return {Promise<void>}
   */
  async getWish(ctx, next) {
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

    const newItem = wishHelper.makeWish(userData);

    ctx.body = {
      userData,
      newItem,
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
  async getWishX10(ctx, next) {
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

    let messageTemplate = ejs.render(templates.tgBot.profile, {
      $t,
      userData,
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
