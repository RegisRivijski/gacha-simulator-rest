import _ from 'lodash';

import {
  TELEGRAM_GROUP_TYPE,
  TELEGRAM_USER_TYPE,
} from '../constants/index.js';

import LoggerService from '../classes/ActionServices/LoggerService.js';
import GroupChats from '../models/genshinImpactTgBot/groupChats.js';
import UsersModel from '../models/genshinImpactTgBot/users.js';

import * as cronHelper from '../helpers/analyticsHelper.js';

export async function getUsersAndGroupChatsList(ctx, next) {
  const users = await UsersModel.find({})
    .catch((e) => {
      LoggerService.error('analyticsController getUsersAndGroupChats UsersModel find:', e);
      ctx.throw(500);
    });

  const groups = await GroupChats.find({})
    .catch((e) => {
      LoggerService.error('analyticsController getUsersAndGroupChats GroupChats find:', e);
      ctx.throw(500);
    });

  ctx.body = [
    ..._.map(users, ({ chatId }) => chatId),
    ..._.map(groups, ({ groupChatId }) => groupChatId),
  ];
  ctx.status = 200;
  await next();
}

export async function getUsersAndGroupChats(ctx, next) {
  const users = await UsersModel.find({})
    .catch((e) => {
      LoggerService.error('analyticsController getAllUsersAndGroupChats UsersModel find:', e);
      ctx.throw(500);
    });

  const groups = await GroupChats.find({})
    .catch((e) => {
      LoggerService.error('analyticsController getAllUsersAndGroupChats GroupChats find:', e);
      ctx.throw(500);
    });

  ctx.body = {
    users: _.map(users, ({ chatId }) => chatId),
    groups: _.map(groups, ({ groupChatId }) => groupChatId),
  };
  ctx.status = 200;
  await next();
}

export async function activeTelegramBot(ctx, next) {
  const { type, id, isActive = false } = ctx.request.body;
  ctx.assert(type && id, 400);

  let notificationData = {};
  switch (type) {
    case TELEGRAM_USER_TYPE:
      notificationData = await cronHelper.configureTelegramUsersForNotifications({
        chatId: id,
        isActive,
        defaultLangCode: ctx.state.defaultLangCode,
      })
        .catch((e) => {
          LoggerService.error('analyticsController activeTelegramBot cronHelper configureTelegramUsersForNotifications:', e);
        });
      break;
    case TELEGRAM_GROUP_TYPE:
      notificationData = await cronHelper.configureTelegramGroupsForNotifications({
        groupChatId: id,
        isActive,
        defaultLangCode: ctx.state.defaultLangCode,
      })
        .catch((e) => {
          LoggerService.error('analyticsController activeTelegramBot cronHelper configureTelegramGroupsForNotifications:', e);
        });
      break;
    default:
      ctx.throw(400);
  }

  ctx.body = notificationData;
  ctx.status = 200;
  await next();
}
