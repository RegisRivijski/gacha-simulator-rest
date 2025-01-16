import * as analyticEventTypes from '../constants/analyticEventTypes.js';

import AnalyticService from '../classes/ActionServices/AnalyticService.js';
import LoggerService from '../classes/ActionServices/LoggerService.js';
import GroupChats from '../models/genshinImpactTgBot/groupChats.js';

import * as documentsHelper from '../helpers/documentsHelper.js';

export async function getGroupChat(ctx, next) {
  const { groupChatId } = ctx.request.params;
  ctx.assert(groupChatId, 400, 'groupChatData is required');

  const groupChatData = await GroupChats.findOne({ groupChatId })
    .catch((e) => {
      LoggerService.error('groupChatController getGroupChat GroupChats findOne:', e);
      ctx.throw(500);
    });
  ctx.assert(groupChatData?.groupChatId, 404, 'User not found.');

  ctx.body = groupChatData;
  ctx.status = 200;
  await next();
}

export async function updateGroupChat(ctx, next) {
  const { groupChatId } = ctx.request.params;
  ctx.assert(groupChatId, 400, 'groupChatId is required');

  const { fields } = ctx.request.body;
  ctx.assert(fields, 400, 'fields are required');

  let groupChatData = await GroupChats.findOne({ groupChatId })
    .catch((e) => {
      LoggerService.error('groupChatController updateGroupChat GroupChats findOne:', e);
      ctx.throw(500);
    });
  ctx.assert(groupChatData?.groupChatId, 404, 'User not found.');

  groupChatData = documentsHelper.update(groupChatData, fields);
  groupChatData.updated = Date.now();

  groupChatData = await groupChatData.save()
    .catch((e) => {
      LoggerService.error('groupChatController updateGroupChat GroupChats groupChatData save:', e);
      ctx.throw(500);
    });

  AnalyticService.logEvent({
    eventType: analyticEventTypes.GROUP_CHAT_UPDATE,
    userId: groupChatId,
  })
    .catch((e) => {
      LoggerService.error('groupChatController updateGroupChat AnalyticService logEvent:', e);
    });

  ctx.body = groupChatData;
  ctx.status = 200;
  await next();
}

export async function addGroupChat(ctx, next) {
  const { groupChatId } = ctx.request.params;
  ctx.assert(groupChatId, 400, 'groupChatId is required');

  let groupChatData = await GroupChats.findOne({ groupChatId })
    .catch((e) => {
      LoggerService.error('groupChatController addGroupChat GroupChats findOne:', e);
      ctx.throw(500);
    });
  ctx.assert(!groupChatData?.groupChatId, 400, 'GroupChat is already created.');

  const {
    groupTitle,
    groupUsername,
  } = ctx.request.body;

  groupChatData = new GroupChats({
    groupChatId,
    groupTitle,
    groupUsername,
  });

  groupChatData = await groupChatData.save()
    .catch((e) => {
      LoggerService.error('groupChatController addGroupChat GroupChats groupChatData save:', e);
      ctx.throw(500);
    });

  AnalyticService.logEvent({
    eventType: analyticEventTypes.NEW_GROUP_CHAT,
    userId: groupChatId,
  })
    .catch((e) => {
      LoggerService.error('groupChatController addGroupChat AnalyticService logEvent:', e);
    });

  ctx.body = groupChatData;
  ctx.status = 200;
  await next();
}
