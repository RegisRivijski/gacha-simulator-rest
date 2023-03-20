import _ from 'lodash';
import ejs from 'ejs';

import {
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
  EVENT_BANNER_CATEGORY_NAME,
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
  USERS_HISTORY_ACTION_WISH,
  USERS_HISTORY_ACTION_PRIMOGEMS,
  USERS_HISTORY_LOGS_PER_PAGE,
  MEDIA_TYPE_STICKER,
} from '../constants/index.js';
import {
  PRIMOGEMS_REFERRAL_REWARD,
} from '../constants/economy.js';

import UsersModel from '../models/users.js';
import HistoryModel from '../models/histories.js';
import ItemsModel from '../models/items.js';

import Translates from '../classes/Translates.js';

import * as documentsHelper from '../helpers/documentsHelper.js';
import * as bannersHelper from '../helpers/bannersHelper.js';
import * as itemsHelper from '../helpers/itemsHelper.js';
import * as userHelper from '../helpers/usersHelper.js';
import * as historyHelper from '../helpers/historyHelper.js';
import * as inventoryHelper from '../helpers/inventoryHelper.js';

import * as minify from '../helpers/minify.js';
import * as linksHelper from '../helpers/linksHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';

/**
 * Get userData by chatId with additional data for crons or analytics
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getUser(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  ctx.body = {
    ...userData,
    additionalData: userHelper.getAdditionalData(userData),
  };
  ctx.status = 200;
  await next();
}

/**
 * Update userData controller.
 * Fileds must be in format like that: [ { key: 'isBlocked' value: false } ]
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function updateUser(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { fields } = ctx.request.body;
  ctx.assert(fields, 400, 'fields are required');

  let { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(userData?.chatId, 404, 'User not found.');

  userData = documentsHelper.update(userData, fields);

  userData = await userData.save()
    .catch((e) => {
      console.error('[ERROR] userController changeUser UsersModel userData save:', e.message);
      ctx.throw(500);
    });

  ctx.body = userData;
  ctx.status = 200;
  await next();
}

/**
 * Adding user controller
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function addUser(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  let userData = await UsersModel.findOne({ chatId })
    .catch((e) => {
      console.error('[ERROR] userController getUser UsersModel findOne:', e.message);
      ctx.throw(500);
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
      ctx.throw(500);
    });

  ctx.body = userData;
  ctx.status = 200;
  await next();
}

/**
 * Getting templates for telegram bot profile command
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getTgBotProfile(ctx, next) {
  const { chatId } = ctx.request.params;
  const { getPrimogems, changeBanner } = ctx.request.query;
  ctx.assert(chatId, 400, 'chatId is required');
  const { isAction } = ctx.state;

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  if (changeBanner) {
    userData.currentBanner = bannersHelper.getNextBanner(userData.currentBanner);
  }

  const {
    currentBannerIsValid,
    currentBanner,
  } = userHelper.validateCurrentBanner(userData);

  const primogemsAdded = userHelper.getPrimogems(userData);

  if (getPrimogems) {
    userData.primogems += primogemsAdded;
    userData.primogemsAdded = Date.now();
  }

  if (!currentBannerIsValid) {
    userData.currentBanner = currentBanner;
  }

  if (!currentBannerIsValid || (getPrimogems && primogemsAdded) || changeBanner) {
    userData.save()
      .catch((e) => {
        console.error('[ERROR] userController getProfile UserModel userData save:', e.message);
      });
  }

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const activeEventBanners = bannersHelper.getActiveEventBanners()
    .map((banner) => ({
      ...banner,
      ...bannersHelper.getAdditionalBannerData({
        banner,
        languageCode,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    }));
  const activeUniversalBanners = bannersHelper.getActiveUniversalBanners()
    .map((banner) => ({
      ...banner,
      ...bannersHelper.getAdditionalBannerData({
        banner,
        languageCode,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    }));

  let currentBannerData = bannersHelper.getBannerData(currentBanner);
  currentBannerData = {
    ...currentBannerData,
    ...bannersHelper.getAdditionalBannerData({
      banner: currentBannerData,
      languageCode,
      defaultLangCode: ctx.state.defaultLangCode,
    }),
  };
  const currentBannerChances = bannersHelper.calculateDropChances({
    type: currentBannerData.type,
    fourStar: _.result(userData, [currentBannerData.type, 'fourStar'], 0),
    fiveStar: _.result(userData, [currentBannerData.type, 'fiveStar'], 0),
  });

  let messageTemplate = await ejs.renderFile('./templates/tgBot/profile.ejs', {
    _,
    $t,
    itemsHelper,
    userData,
    activeEventBanners,
    activeUniversalBanners,
    currentBannerData,
    currentBannerChances,
    additionalData: userHelper.getAdditionalData(userData),
    defaultLangCode: ctx.state.defaultLangCode,
    bannersHelper,
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
    media: {
      mediaMarkupButtons: telegramButtons.getProfileButtons({
        $t,
        chatId,
        primogemsAdded,
        getPrimogems,
      }),
    },
    updateMessage: isAction,
  };
  ctx.status = 200;
  await next();
}

/**
 * Getting templates for telegram bot history command
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getTgBotHistory(ctx, next) {
  const { isAction } = ctx.state;
  const { chatId } = ctx.request.params;
  const page = Number(ctx.request.params.page);
  ctx.assert(chatId, 400, 'chatId and page is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getHistory UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

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
      .then((data) => historyHelper.addingDataToLogsForTemplate(data, languageCode, ctx.state.defaultLangCode))
      .catch((e) => {
        console.error('[ERROR] userController getHistory HistoryModel find:', e.message);
        ctx.throw(500);
      }),
    // historyLogsCount
    HistoryModel.count({ chatId })
      .catch((e) => {
        console.error('[ERROR] userController getHistory HistoryModel count:', e.message);
        return 0;
      }),
  ]);

  const pagesCount = Math.ceil(historyLogsCount / USERS_HISTORY_LOGS_PER_PAGE);

  let messageTemplate = await ejs.renderFile('./templates/tgBot/history.ejs', {
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
    media: {
      mediaMarkupButtons: telegramButtons.getHistoryButtons({
        $t,
        chatId,
        page,
        pagesCount,
      }),
    },
    updateMessage: isAction,
  };
  ctx.status = 200;
  await next();
}

/**
 * Getting templates for telegram bot inventory command
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getTgBotInventory(ctx, next) {
  const { chatId } = ctx.request.params;
  const { isAction } = ctx.state;

  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getInventory UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const inventoryData = await ItemsModel.find({ chatId })
    .then((itemsData) => inventoryHelper.makingInventoryTree(itemsData, languageCode, ctx.state.defaultLangCode))
    .catch((e) => {
      console.error('[ERROR] userController getInventory ItemsModel find:', e.message);
      ctx.throw(500);
    });

  let messageTemplate = await ejs.renderFile('./templates/tgBot/inventory.ejs', {
    $t,
    userData,
    inventoryData,
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: telegramButtons.getInventoryButtons({
        $t,
        chatId,
      }),
    },
    updateMessage: isAction,
  };
  ctx.status = 200;
  await next();
}

/**
 * Getting templates for telegram bot get primogems command
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getTgBotPrimogems(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getTgBotPrimogems UsersModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(userData?.chatId, 404, 'User not found.');

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const primogemsAdded = userHelper.getPrimogems(userData);

  if (primogemsAdded) {
    userData.primogems += primogemsAdded;
    userData.primogemsAdded = Date.now();
    await userData.save()
      .catch((e) => {
        console.error('[ERROR] userController getTgBotPrimogems UserModel userData save:', e.message);
        ctx.throw(500);
      });
  }

  let messageTemplate = await ejs.renderFile('./templates/tgBot/primogems.ejs', {
    $t,
    userData,
    primogemsAdded,
    additionalData: userHelper.getAdditionalData(userData),
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  const mediaType = MEDIA_TYPE_STICKER;
  const media = linksHelper.getLinkForGetPrimogems(primogemsAdded);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaType,
      media,
    },
  };
  ctx.status = 200;
  await next();
}

export async function getTgBotReferral(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getTgBotReferral UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const telegramBotLink = linksHelper.getBotLinkByLangCode(ctx.state.defaultLangCode);
  const startData = {
    referralInviteChatId: userData.chatId,
  };

  let messageTemplate = await ejs.renderFile('./templates/tgBot/referral.ejs', {
    $t,
    userData,
    PRIMOGEMS_REFERRAL_REWARD,
    telegramBotLink,
    startData,
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
  };
  ctx.status = 200;
  await next();
}
