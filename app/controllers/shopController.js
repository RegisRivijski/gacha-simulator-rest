import _ from 'lodash';
import ejs from 'ejs';

import * as analyticEventTypes from '../constants/analyticEventTypes.js';

import AnalyticService from '../classes/ActionServices/AnalyticService.js';
import LoggerService from '../classes/ActionServices/LoggerService.js';
import Translates from '../classes/Translates.js';

import ShopModel from '../models/genshinImpactTgBot/shop.js';
import SuccessfulPayment from '../models/genshinImpactTgBot/successfulPayment.js';

import * as userHelper from '../helpers/usersHelper.js';
import * as shopHelper from '../helpers/shopHelper.js';

import * as minify from '../helpers/minify.js';
import * as telegramButtons from '../helpers/telegramButtons.js';

export async function getAllShopItems(ctx, next) {
  const allShopItems = await ShopModel.find({})
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js getAllShopItems find:', e);
      ctx.throw(500);
    });

  ctx.body = allShopItems;
  ctx.status = 200;
  await next();
}

export async function getShopItemById(ctx, next) {
  const shopItemId = ctx.request.params.id;

  ctx.assert(shopItemId, 400, 'id is required');

  const shopItemData = await ShopModel.findOne({ shopItemId })
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js getShopItemById findOne:', e);
      ctx.throw(500);
    });

  ctx.assert(shopItemData, 404);

  ctx.body = shopItemData;
  ctx.status = 200;
  await next();
}

export async function changeShopItemById(ctx, next) {
  let { shopItemData } = ctx.request.body;

  const shopItemId = shopItemData?.shopItemId;

  ctx.assert(shopItemId, 400, 'shopItemData.shopItemId is required');

  shopItemData = await ShopModel.findOneAndUpdate({ shopItemId }, shopItemData, { new: true })
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js changeShopItemById findOneAndUpdate:', e);
      ctx.throw(500);
    });

  ctx.body = shopItemData;
  ctx.status = 200;
  await next();
}

export async function createShopItem(ctx, next) {
  let { shopItemData } = ctx.request.body;

  ctx.assert(shopItemData.count, 400, 'count is required');
  ctx.assert(shopItemData.starsCost, 400, 'starsCost is required');

  try {
    shopItemData = new ShopModel(shopItemData);
  } catch (e) {
    LoggerService.error('app/controllers/shopController.js createShopItem new ShopModel:', e);
    ctx.throw(500);
  }

  await shopItemData.save()
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js createShopItem save:', e);
      ctx.throw(500);
    });

  ctx.body = shopItemData;
  ctx.status = 200;
  await next();
}

export async function deleteShopItem(ctx, next) {
  const shopItemId = ctx.request.params.id;

  ctx.assert(shopItemId, 400, 'shopItemId is required');

  await ShopModel.deleteOne({ shopItemId })
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js deleteShopItem deleteOne:', e);
      ctx.throw(500);
    });

  ctx.status = 204;
  await next();
}

export async function getTgBotShopItems(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('shopController getShop UsersModel findOne:', e);
      ctx.throw(500);
    });

  const shopItems = await shopHelper.getAvailableShopItems()
    .catch((e) => {
      LoggerService.error('shopController getShop shopHelper getAvailableShopItems:', e);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  let messageTemplate = await ejs.renderFile('./templates/tgBot/shop.ejs', {
    _,
    $t,
    userData,
    shopItems,
    additionalData: userHelper.getAdditionalData(userData),
  });

  AnalyticService.logEvent({
    eventType: analyticEventTypes.TG_SHOP,
    userId: userData.chatId,
  })
    .catch((e) => {
      LoggerService.error('shopController getTgBotShopItems AnalyticService logEvent:', e);
    });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: telegramButtons.getShopButtons({
        $t,
        shopItems,
      }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function getTgBotBuyShopItems(ctx, next) {
  const shopItemId = ctx.request.params.id;
  const { chatId } = ctx.request.params;

  ctx.assert(chatId, 400, 'chatId is required');
  ctx.assert(shopItemId, 400, 'id is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('shopController getShop UsersModel findOne:', e);
      ctx.throw(500);
    });

  const shopItemData = await ShopModel.findOne({ shopItemId })
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js getShopItemById findOne:', e);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  let messageTemplate = await ejs.renderFile('./templates/tgBot/shopBuyItem.ejs', {
    _,
    $t,
    userData,
    shopItemData,
  });

  AnalyticService.logEvent({
    eventType: analyticEventTypes.TG_SHOP_BUY_ITEM,
    userId: userData.chatId,
  })
    .catch((e) => {
      LoggerService.error('shopController getTgBotShopItems AnalyticService logEvent:', e);
    });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    media: {
      invoice: shopHelper.getInvoice({
        $t,
        shopItemData,
        messageTemplate,
      }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function getTgBotProceedPayment(ctx, next) {
  const shopItemId = ctx.request.params.id;
  const { chatId } = ctx.request.params;

  ctx.assert(chatId, 400, 'chatId is required');
  ctx.assert(shopItemId, 400, 'id is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('shopController getTgBotProceedPayment UsersModel findOne:', e);
      ctx.throw(500);
    });

  const shopItemData = await ShopModel.findOne({ shopItemId })
    .catch((e) => {
      LoggerService.error('shopController getTgBotProceedPayment getShopItemById findOne:', e);
      ctx.throw(500);
    });

  ctx.assert(
    shopItemData?.shopItemId
    && shopItemData?.currencyType
    && shopItemData?.count
    && shopItemData?.starsCost,
    400,
    'shopItemData is invalid',
  );

  userData[shopItemData.currencyType] += shopItemData.count;
  userData.starsDonated += shopItemData.starsCost;
  userData.sponsor = true;

  userData.save()
    .catch((e) => {
      LoggerService.error('shopController getTgBotProceedPayment UsersModel save:', e);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  let messageTemplate = await ejs.renderFile('./templates/tgBot/shopProceed.ejs', {
    _,
    $t,
    userData,
    shopItemData,
    additionalData: userHelper.getAdditionalData(userData),
  });

  AnalyticService.logEvent({
    eventType: analyticEventTypes.TG_SHOP_PROCEED,
    userId: userData.chatId,
  })
    .catch((e) => {
      LoggerService.error('shopController getTgBotProceedPayment AnalyticService logEvent:', e);
    });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: telegramButtons.getMainLinks({
        $t,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function createSuccessfulPayments(ctx, next) {
  let { successfulPayment } = ctx.request.body;

  try {
    successfulPayment = new SuccessfulPayment(successfulPayment);
  } catch (e) {
    LoggerService.error('app/controllers/shopController.js createSuccessfulPayments new SuccessfulPayment:', e);
    ctx.throw(500);
  }

  await successfulPayment.save()
    .catch((e) => {
      LoggerService.error('app/controllers/shopController.js createSuccessfulPayments save:', e);
      ctx.throw(500);
    });

  ctx.body = successfulPayment;
  ctx.status = 200;
  await next();
}
