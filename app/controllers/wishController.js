const _ = require('lodash');
const ejs = require('ejs');

const {
  USERS_HISTORY_ACTION_WISH,
} = require('../constants/index');

const UsersModel = require('../models/users');
const HistoryModel = require('../models/histories');

const documentsHelper = require('../helpers/documentsHelper');
const translatesHelper = require('../helpers/translatesHelper');
const userHelper = require('../helpers/usersHelper');
const wishHelper = require('../helpers/wishHelper');
const itemsHelper = require('../helpers/itemsHelper');
const inventoryHelper = require('../helpers/inventoryHelper');
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
    const canBuy = Boolean(price.key);

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

      await inventoryHelper.addingNewItem({
        chatId,
        ...newItem,
      })
        .catch((e) => {
          console.error('[ERROR] wishController getWish inventoryHelper addingNewItem:', e.message);
          ctx.throw(500);
        });

      new HistoryModel({
        chatId,
        action: USERS_HISTORY_ACTION_WISH,
        banner: currentBanner,
        type: newItem.newItemType,
        objKey: newItem.newItemObjKey,
        currency: price.key,
        currencyCount: price.value,
      }).save()
        .catch((e) => {
          console.error('[ERROR] wishController getWish new HistoryModel save', e.message);
        });
    }

    if (!currentBannerIsValid || canBuy) {
      userData.currentBanner = currentBanner;
      userData[price.key] -= price.value;
      userData.save()
        .catch((e) => {
          console.error('[ERROR] wishController getWish UserModel userData save:', e.message);
        });
    }

    let messageTemplate = ejs.render(templates.tgBot.wish, {
      $t,
      userData,
      canBuy,
      price,
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
        console.error('[ERROR] wishController getWishX10 UsersModel findOne:', e.message);
        ctx.throw(500);
      });
    ctx.assert(userData?.chatId, 404, 'User not found.');

    const {
      currentBannerIsValid,
      currentBanner,
    } = userHelper.validateCurrentBanner(userData);

    const wishesCount = 10;
    const currentBannerData = bannersHelper.getBannerData(currentBanner);
    const currentBannerType = _.result(currentBannerData, 'type');
    const currentBannerPrices = bannersHelper.getBannerPrices(currentBannerType);

    const prices = financialOperationsHelper.determinePriceFewTimes(userData, currentBannerPrices, wishesCount);
    const canBuy = Boolean(prices.length >= wishesCount);

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    let newItems;
    let newItemsData;

    if (canBuy) {
      newItems = wishHelper.makeWishFewTimes(userData, wishesCount);
      newItemsData = newItems.map((newItem) => itemsHelper.getItemData({
        langCode: languageCode,
        objKey: newItem.newItemObjKey,
        type: newItem.newItemType,
      }));

      await inventoryHelper.addingManyNewItems({
        chatId,
        newItems,
      })
        .catch((e) => {
          console.error('[ERROR] wishController getWish inventoryHelper addingNewItem:', e.message);
          ctx.throw(500);
        });
    }

    if (!currentBannerIsValid || canBuy) {
      userData.currentBanner = currentBanner;
      for (const price of prices) {
        userData[price.key] -= price.value;
      }
      userData.save()
        .catch((e) => {
          console.error('[ERROR] wishController getWishX10 UserModel userData save:', e.message);
        });
    }

    let messageTemplate = ejs.render(templates.tgBot.wishX10, {
      $t,
      userData,
      canBuy,
      newItemsData,
      prices: documentsHelper.assignNumbersInObjectFromKeyValueArray(prices),
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