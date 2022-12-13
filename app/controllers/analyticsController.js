import _ from 'lodash';

import GroupChats from '../models/groupChats.js';
import UsersModel from '../models/users.js';

export async function getUsersAndGroupChats(ctx, next) {
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
