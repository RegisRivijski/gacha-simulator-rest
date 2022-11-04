const _ = require('lodash');
const ejs = require('ejs');

const {
  USERS_HISTORY_ACTION_WISH,
} = require('../constants/index');

const UsersModel = require('../models/users');
const HistoryModel = require('../models/histories');
const ItemsModel = require('../models/items');

const translatesHelper = require('../helpers/translatesHelper');
const userHelper = require('../helpers/usersHelper');
const wishHelper = require('../helpers/wishHelper');
const itemsHelper = require('../helpers/itemsHelper');
const financialOperationsHelper = require('../helpers/financialOperationsHelper');

const templates = require('../modules/templates');
const minify = require('../modules/minify');
const bannersHelper = require('../helpers/bannersHelper');

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
        console.error('[ERROR] wishController getWish UsersModel findOne:', e.message);
        ctx.throw(500);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const {
      currentBannerIsValid,
      currentBanner,
    } = userHelper.validateCurrentBanner(userData);

    const currentBannerData = bannersHelper.getBannerData(currentBanner);
    const currentBannerType = _.result(currentBannerData, 'type');
    const currentBannerPrices = bannersHelper.getBannerPrices(currentBannerType);

    const price = financialOperationsHelper.determinePrice(userData, currentBannerPrices);
    const canBuy = Boolean(price.currency);

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    let newItem;
    let newItemData;

    if (canBuy) {
      newItem = wishHelper.makeWish(userData);
      newItemData = itemsHelper.getItemData({
        langCode: languageCode,
        objKey: newItem.newItemObjKey,
        type: newItem.newItemType,
      });

      const currentInventoryItem = await ItemsModel.findOne({
        chatId,
        objKey: newItem.newItemObjKey,
        type: newItem.newItemType,
      })
        .catch((e) => {
          console.error('[ERROR] wishController getWish ItemsModel findOne:', e.message);
          ctx.throw(500);
        });

      if (currentInventoryItem) {
        currentInventoryItem.count += 1;
        currentInventoryItem.save()
          .catch((e) => {
            console.error('[ERROR] wishController getWish currentInventoryItem save:', e.message);
            ctx.throw(500);
          });
      } else {
        new ItemsModel({
          chatId,
          type: newItem.newItemType,
          objKey: newItem.newItemObjKey,
          count: 1,
        }).save()
          .catch((e) => {
            console.error('[ERROR] wishController getWish new ItemsModel save', e.message);
            ctx.throw(500);
          });
      }

      new HistoryModel({
        chatId,
        action: USERS_HISTORY_ACTION_WISH,
        banner: currentBanner,
        type: newItem.newItemType,
        objKey: newItem.newItemObjKey,
        currency: price.currency,
        currencyCount: price.cost,
      }).save()
        .catch((e) => {
          console.error('[ERROR] wishController getWish new HistoryModel save', e.message);
        });
    }

    if (!currentBannerIsValid || canBuy) {
      userData.currentBanner = currentBanner;
      userData[price.currency] -= price.cost;
      userData.save()
        .catch((e) => {
          console.error('[ERROR] wishController getWish UserModel userData save:', e.message);
        });
    }

    let messageTemplate = ejs.render(templates.tgBot.wish, {
      $t,
      userData,
      canBuy,
      newItemData,
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
  async getWishX10(ctx, next) {
    const { chatId } = ctx.request.params;
    ctx.assert(chatId, 400, 'chatId is required');

    const userData = await UsersModel.findOne({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
        ctx.throw(500);
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

    let messageTemplate = ejs.render(templates.tgBot.wish, {
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
