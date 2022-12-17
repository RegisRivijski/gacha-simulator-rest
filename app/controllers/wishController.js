import _ from 'lodash';
import ejs from 'ejs';

import {
  MEDIA_TYPE_PHOTO,
  MEDIA_TYPE_STICKER,
  WISH_GIF_TTL,
} from '../constants/index.js';

import * as wishHelper from '../helpers/wishHelper.js';
import * as userHelper from '../helpers/usersHelper.js';
import * as bannersHelper from '../helpers/bannersHelper.js';
import * as translatesHelper from '../helpers/translatesHelper.js';
import * as documentsHelper from '../helpers/documentsHelper.js';
import * as financialOperationsHelper from '../helpers/financialOperationsHelper.js';
import * as linksHelper from '../helpers/linksHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';

import templates from '../modules/templates.js';
import * as minify from '../modules/minify.js';

export async function getWish(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] wishController getWish UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { currentBanner } = userHelper.validateCurrentBanner(userData);

  const currentBannerData = bannersHelper.getBannerData(currentBanner);
  const currentBannerType = _.result(currentBannerData, 'type');
  const currentBannerPrices = bannersHelper.getBannerPrices(currentBannerType);

  const price = financialOperationsHelper.determinePrice(userData, currentBannerPrices);
  const canBuy = Boolean(price.key);

  const { languageCode } = userData;
  const $t = translatesHelper.getTranslate(languageCode);

  let media;
  let mediaGif;
  let mediaGifMessage;
  let mediaType;
  let mediaMarkupButtons;
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

    mediaType = MEDIA_TYPE_PHOTO;
    mediaGif = linksHelper.getLinkToWishGif(newItem.newItemRarity);
    mediaGifMessage = '';
    media = linksHelper.getItemImage({
      languageCode,
      itemType: newItem.newItemType,
      objKey: newItem.newItemObjKey,
    });

    userData.currentBanner = currentBanner;
    userData[price.key] -= price.value;

    if (cashBackForDuplicate.price) {
      userData[cashBackForDuplicate.currency] += cashBackForDuplicate.price;
    }

    const nextPrice = financialOperationsHelper.determinePrice(userData, currentBannerPrices);
    const canBuyOneMoreTime = Boolean(nextPrice.key);

    mediaMarkupButtons = telegramButtons.getForWish({
      $t,
      canBuyOneMoreTime,
      chatId,
    });

    userData.updated = Date.now();
    userData.save()
      .catch((e) => {
        console.error('[ERROR] wishController getWish UserModel userData save:', e.message);
      });
  } else {
    mediaType = MEDIA_TYPE_STICKER;
    media = linksHelper.getLinkToFatesSticker(currentBannerType);
  }

  let messageTemplate = ejs.render(templates.tgBot.wish, {
    $t,
    userData,
    canBuy,
    price,
    currentBannerType,
    newItemData: newItem.newItemData,
    cashBackTemplate: cashBackForDuplicate.cashBackTemplate,
    bannerName: bannersHelper.getBannerName(userData),
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      media,
      mediaType,
      mediaMarkupButtons,
    },
    gifBeforeMessage: {
      media: mediaGif,
      mediaGifMessage,
      ttl: WISH_GIF_TTL,
    },
  };
  ctx.status = 200;
  await next();
}

export async function getWishX10(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] wishController getWishX10 UsersModel findOne:', e.message);
      ctx.throw(500);
    });

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

  let media;
  let mediaGif;
  let mediaGifMessage;
  let mediaMarkupButtons;
  let mediaType;
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

    wishesData = wishHelper.orderWishes({
      wishesData,
      currentBannerType,
    });

    mediaType = MEDIA_TYPE_PHOTO;
    mediaGif = linksHelper.getLinkToWishX10Gif(_.result(_.first(wishesData), 'newItem.newItemRarity'));
    mediaGifMessage = '';
    media = linksHelper.getItemImage({
      languageCode,
      itemType: _.result(_.first(wishesData), 'newItem.newItemType'),
      objKey: _.result(_.first(wishesData), 'newItem.newItemObjKey'),
    });

    userData.currentBanner = currentBanner;
    for (const wishData of wishesData) {
      const { price, cashBackForDuplicate } = wishData;
      userData[price.key] -= price.value;
      if (cashBackForDuplicate.price) {
        userData[cashBackForDuplicate.currency] += cashBackForDuplicate.price;
      }
    }

    const nextPrices = financialOperationsHelper.determinePriceFewTimes(wallet, currentBannerPrices, wishesCount);
    const canBuyOneMoreTime = Boolean(nextPrices.length >= wishesCount);

    mediaMarkupButtons = telegramButtons.getForWishX10({
      $t,
      canBuyOneMoreTime,
      chatId,
    });

    userData.updated = Date.now();
    userData.save()
      .catch((e) => {
        console.error('[ERROR] wishController getWishX10 UserModel userData save:', e.message);
      });
  } else {
    mediaType = MEDIA_TYPE_STICKER;
    media = linksHelper.getLinkToFatesSticker(currentBannerType);
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
    currentBannerType,
    bannerName: bannersHelper.getBannerName(userData),
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      media,
      mediaType,
      mediaMarkupButtons,
    },
    gifBeforeMessage: {
      media: mediaGif,
      mediaGifMessage,
      ttl: WISH_GIF_TTL,
    },
  };
  ctx.status = 200;
  await next();
}
