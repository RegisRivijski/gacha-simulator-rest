import {
  TELEGRAM_USER_TYPE,
  TELEGRAM_GROUP_TYPE,
} from '../constants/index.js';

import ActiveGroupsByDefaultLanguage from '../models/activeGroupsByDefaultLanguage.js';
import ActiveUsersByDefaultLanguage from '../models/activeUsersByDefaultLanguage.js';
import UsersModel from '../models/users.js';

import * as userHelper from '../helpers/usersHelper.js';

export async function getAllActiveUsersWithPrimogemsLimit(ctx, next) {
  const activeUsers = await ActiveUsersByDefaultLanguage.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      console.error('[ERROR] cronController getAllActiveUsersWithPrimogemsLimit ActiveUsersByDefaultLanguage find:', e.message);
      ctx.throw(500);
    });

  const allUsersData = await UsersModel.find({
    chatId: activeUsers.map(({ chatId }) => chatId),
  })
    .catch((e) => {
      console.error('[ERROR] cronController getAllActiveUsersWithPrimogemsLimit UsersModel find:', e.message);
      ctx.throw(500);
    });

  const allUsersWithPrimogemsLimit = allUsersData.filter((userData) => {
    const additionalData = userHelper.getAdditionalData(userData);
    return additionalData?.primogemsGetMaxLimit;
  });

  ctx.body = allUsersWithPrimogemsLimit.map(({ chatId }) => chatId);
  ctx.status = 200;
  await next();
}

export async function getAllActiveUsersHowManyCanBuyWishes(ctx, next) {
  const activeUsers = await ActiveUsersByDefaultLanguage.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      console.error('[ERROR] cronController getAllActiveUsersHowManyCanBuyWishes ActiveUsersByDefaultLanguage find:', e.message);
      ctx.throw(500);
    });

  const allUsersData = await UsersModel.find({
    chatId: activeUsers.map(({ chatId }) => chatId),
  })
    .catch((e) => {
      console.error('[ERROR] cronController getAllActiveUsersHowManyCanBuyWishes UsersModel find:', e.message);
      ctx.throw(500);
    });

  const allUsersWithPrimogemsLimit = allUsersData.filter((userData) => {
    const additionalData = userHelper.getAdditionalData(userData);
    return additionalData?.howManyUserCanBuy;
  });

  ctx.body = allUsersWithPrimogemsLimit.map(({ chatId }) => chatId);
  ctx.status = 200;
  await next();
}

export async function configureForNotifications(ctx, next) {
  const { type, id, isActive } = ctx.request.params;
  ctx.assert(type && id && isActive, 400);

  switch (type) {
    case TELEGRAM_USER_TYPE:

      break;
    case TELEGRAM_GROUP_TYPE:

      break;
    default:
      ctx.throw(400);
  }

  ctx.body = 'OK';
  ctx.status = 200;
  await next();
}
