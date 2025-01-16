import LoggerService from '../classes/ActionServices/LoggerService.js';

import UsersByBots from '../models/genshinImpactTgBot/usersByBots.js';
import UsersModel from '../models/genshinImpactTgBot/users.js';
import GroupsByBots from '../models/genshinImpactTgBot/groupsByBots.js';

import * as userHelper from '../helpers/usersHelper.js';

export async function getAllActiveUsersWithPrimogemsLimit(ctx, next) {
  const activeUsers = await UsersByBots.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      LoggerService.error('cronController getAllActiveUsersWithPrimogemsLimit UsersByBots find:', e);
      ctx.throw(500);
    });

  const allUsersData = await UsersModel.find({
    chatId: activeUsers.map(({ chatId }) => chatId),
  })
    .catch((e) => {
      LoggerService.error('cronController getAllActiveUsersWithPrimogemsLimit UsersModel find:', e);
      ctx.throw(500);
    });

  const allUsersWithPrimogemsLimit = allUsersData
    .filter((userData) => {
      const additionalData = userHelper.getAdditionalData(userData);
      return additionalData?.primogemsGetMaxLimit && userData?.notificationsEnable;
    })
    .map((userData) => ({
      chatId: userData.chatId,
      languageCode: userData.languageCode || ctx.state.defaultLangCode,
    }));

  ctx.body = allUsersWithPrimogemsLimit;
  ctx.status = 200;
  await next();
}

export async function getAllActiveUsers(ctx, next) {
  const activeUsers = await UsersByBots.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      LoggerService.error('cronController getAllActiveUsers UsersByBots find:', e);
      ctx.throw(500);
    });

  ctx.body = activeUsers.map(({ chatId }) => chatId);
  ctx.status = 200;
  await next();
}

export async function getAllActiveGroups(ctx, next) {
  const activeGroups = await GroupsByBots.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      LoggerService.error('cronController getAllActiveGroups GroupsByBots find:', e);
      ctx.throw(500);
    });

  ctx.body = activeGroups.map(({ groupChatId }) => groupChatId);
  ctx.status = 200;
  await next();
}
