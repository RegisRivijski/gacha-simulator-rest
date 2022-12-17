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

import UsersModel from '../models/users.js';
import HistoryModel from '../models/histories.js';
import ItemsModel from '../models/items.js';

import * as documentsHelper from '../helpers/documentsHelper.js';
import * as translatesHelper from '../helpers/translatesHelper.js';
import * as bannersHelper from '../helpers/bannersHelper.js';
import * as itemsHelper from '../helpers/itemsHelper.js';
import * as userHelper from '../helpers/usersHelper.js';
import * as historyHelper from '../helpers/historyHelper.js';
import * as inventoryHelper from '../helpers/inventoryHelper.js';

import templates from '../modules/templates.js';
import * as minify from '../modules/minify.js';
import * as linksHelper from '../helpers/linksHelper.js';

/**
 * Get userData by chatId with additional data for crons or analytics
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getUser(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await UsersModel.findOne({ chatId })
    .catch((e) => {
      console.error('[ERROR] userController getUser UsersModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(userData?.chatId, 404, 'User not found.');

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

  let userData = await UsersModel.findOne({ chatId })
    .catch((e) => {
      console.error('[ERROR] userController changeUser UsersModel findOne:', e.message);
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
  const { getPrimogems } = ctx.request.query;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getProfile UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const {
    currentBannerIsValid,
    currentBanner,
  } = userHelper.validateCurrentBanner(userData);

  let primogemsAdded;

  if (getPrimogems) {
    primogemsAdded = userHelper.getPrimogems(userData);
    userData.primogems += primogemsAdded;
    userData.primogemsAdded = Date.now();
  }

  if (!currentBannerIsValid || (getPrimogems && primogemsAdded)) {
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
}

/**
 * Getting templates for telegram bot history command
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getTgBotHistory(ctx, next) {
  const {
    chatId,
  } = ctx.request.params;
  let {
    page = 0,
  } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');
  page = Number(page);

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getHistory UsersModel findOne:', e.message);
      ctx.throw(500);
    });

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
      .then((data) => historyHelper.addingDataToLogsForTemplate(data, languageCode))
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
}

/**
 * Getting templates for telegram bot inventory command
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export async function getTgBotInventory(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getInventory UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const $t = translatesHelper.getTranslate(languageCode);

  const inventoryData = await ItemsModel.find({ chatId })
    .then((itemsData) => inventoryHelper.makingInventoryTree(itemsData, languageCode))
    .catch((e) => {
      console.error('[ERROR] userController getInventory ItemsModel find:', e.message);
      ctx.throw(500);
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

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getTgBotPrimogems UsersModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(userData?.chatId, 404, 'User not found.');

  const { languageCode } = userData;
  const $t = translatesHelper.getTranslate(languageCode);

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

  let messageTemplate = ejs.render(templates.tgBot.primogems, {
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
