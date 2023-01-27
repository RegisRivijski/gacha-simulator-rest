import _ from 'lodash';

import {
  PRIMOGEMS_GET_MAX,
} from '../constants/economy.js';

import GroupChats from '../models/groupChats.js';
import UsersModel from '../models/users.js';

import * as userHelper from '../helpers/usersHelper.js';

export async function getUsersAndGroupChatsList(ctx, next) {
  const users = await UsersModel.find({})
    .catch((e) => {
      console.error('[ERROR] analyticsController getUsersAndGroupChats UsersModel find:', e.message);
      ctx.throw(500);
    });

  const groups = await GroupChats.find({})
    .catch((e) => {
      console.error('[ERROR] analyticsController getUsersAndGroupChats GroupChats find:', e.message);
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
      console.error('[ERROR] analyticsController getAllUsersAndGroupChats UsersModel find:', e.message);
      ctx.throw(500);
    });

  const groups = await GroupChats.find({})
    .catch((e) => {
      console.error('[ERROR] analyticsController getAllUsersAndGroupChats GroupChats find:', e.message);
      ctx.throw(500);
    });

  ctx.body = {
    users: _.map(users, ({ chatId }) => chatId),
    groups: _.map(groups, ({ groupChatId }) => groupChatId),
  };
  ctx.status = 200;
  await next();
}

export async function getAllActiveUsers(ctx, next) {
  const allUsersData = await UsersModel.find({
    isBlocked: false,
  })
    .catch((e) => {
      console.error('[ERROR] userController getAllActiveUsers UsersModel find:', e.message);
      ctx.throw(500);
    });

  ctx.body = allUsersData.map(({ chatId }) => chatId);
  ctx.status = 200;
  await next();
}

export async function getAllActiveUsersWithPrimogemsLimit(ctx, next) {
  const allUsersData = await UsersModel.find({
    isBlocked: false,
  })
    .catch((e) => {
      console.error('[ERROR] userController getAllActiveUsers UsersModel find:', e.message);
      ctx.throw(500);
    });

  const allUsersWithPrimogemsLimit = allUsersData.filter((userData) => {
    const primogems = userHelper.getPrimogems(userData);
    return primogems === PRIMOGEMS_GET_MAX;
  });

  ctx.body = allUsersWithPrimogemsLimit.map(({ chatId }) => chatId);
  ctx.status = 200;
  await next();
}
