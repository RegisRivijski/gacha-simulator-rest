const _ = require('lodash');
const ejs = require('ejs');

const UsersModel = require('../models/users');

const documentsHelper = require('../helpers/documentsHelper');
const translatesHelper = require('../helpers/translatesHelper');
const userHelper = require('../helpers/usersHelper');
const wishHelper = require('../helpers/wishHelper');
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

    const { currentBanner } = userHelper.validateCurrentBanner(userData);

    const currentBannerData = bannersHelper.getBannerData(currentBanner);
    const currentBannerType = _.result(currentBannerData, 'type');
    const currentBannerPrices = bannersHelper.getBannerPrices(currentBannerType);

    const price = financialOperationsHelper.determinePrice(userData, currentBannerPrices);
    const canBuy = Boolean(price.key);

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    let newItem;
    let cashBackForDuplicate;

    if (canBuy) {
      const wishData = await wishHelper.makeWish({
        userData,
        currentBannerData,
        price,
      })
        .catch((e) => {
          console.error('[ERROR] wishController getWish wishHelper makeWish:', e.message);
          ctx.throw(500);
        });

      newItem = wishData.newItem;
      cashBackForDuplicate = wishData.cashBackForDuplicate;

      userData.currentBanner = currentBanner;
      userData[price.key] -= price.value;

      if (cashBackForDuplicate.price) {
        userData[cashBackForDuplicate.currency] += cashBackForDuplicate.price;
      }

      userData.updated = Date.now();
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
      newItemData: newItem.newItemData,
      cashBackTemplate: cashBackForDuplicate.cashBackTemplate,
      bannerName: bannersHelper.getBannerName(userData),
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

    const { currentBanner } = userHelper.validateCurrentBanner(userData);

    const wishesCount = 10;
    const currentBannerData = bannersHelper.getBannerData(currentBanner);
    const currentBannerType = _.result(currentBannerData, 'type');
    const currentBannerPrices = bannersHelper.getBannerPrices(currentBannerType);

    const wallet = _.result(userData, '_doc', {});
    const prices = financialOperationsHelper.determinePriceFewTimes(wallet, currentBannerPrices, wishesCount);
    const canBuy = Boolean(prices.length >= wishesCount);

    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);

    let wishesData;

    if (canBuy) {
      wishesData = await wishHelper.makeWishFewTimes({
        userData,
        currentBannerData,
        prices,
      })
        .catch((e) => {
          console.error('[ERROR] wishController getWishX10 wishHelper makeWishFewTimes:', e.message);
          ctx.throw(500);
        });

      userData.currentBanner = currentBanner;
      for (const wishData of wishesData) {
        const { price, cashBackForDuplicate } = wishData;
        userData[price.key] -= price.value;
        if (cashBackForDuplicate.price) {
          userData[cashBackForDuplicate.currency] += cashBackForDuplicate.price;
        }
      }
      userData.updated = Date.now();
      userData.save()
        .catch((e) => {
          console.error('[ERROR] wishController getWishX10 UserModel userData save:', e.message);
        });
    }

    const templatePrices = documentsHelper.assignNumbersInObjects(
      documentsHelper.makeObjectFromKeyValueArray(prices),
    );

    let messageTemplate = ejs.render(templates.tgBot.wishX10, {
      $t,
      userData,
      canBuy,
      wishesData,
      templatePrices,
      bannerName: bannersHelper.getBannerName(userData),
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
