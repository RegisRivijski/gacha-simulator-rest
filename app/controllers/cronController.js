import UsersByBots from '../models/genshinImpactTgBot/usersByBots.js';
import UsersModel from '../models/genshinImpactTgBot/users.js';

import * as userHelper from '../helpers/usersHelper.js';

export async function getAllActiveUsersWithPrimogemsLimit(ctx, next) {
  const activeUsers = await UsersByBots.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      console.error('[ERROR] cronController getAllActiveUsersWithPrimogemsLimit UsersByBots find:', e.message);
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
  const activeUsers = await UsersByBots.find({
    isActive: true,
    defaultLangCode: ctx.state.defaultLangCode,
  })
    .catch((e) => {
      console.error('[ERROR] cronController getAllActiveUsersHowManyCanBuyWishes UsersByBots find:', e.message);
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
