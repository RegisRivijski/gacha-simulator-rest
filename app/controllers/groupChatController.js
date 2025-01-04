import * as analyticEventTypes from '../constants/analyticEventTypes.js';

import GroupChats from '../models/genshinImpactTgBot/groupChats.js';

import * as analyticsManager from '../managers/analyticsManager.js';
import * as documentsHelper from '../helpers/documentsHelper.js';

export async function getGroupChat(ctx, next) {
  const { groupChatId } = ctx.request.params;
  ctx.assert(groupChatId, 400, 'groupChatData is required');

  const groupChatData = await GroupChats.findOne({ groupChatId })
    .catch((e) => {
      console.error('[ERROR] groupChatController getGroupChat GroupChats findOne:', e.message);
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
      console.error('[ERROR] groupChatController updateGroupChat GroupChats findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(groupChatData?.groupChatId, 404, 'User not found.');

  groupChatData = documentsHelper.update(groupChatData, fields);
  groupChatData.updated = Date.now();

  groupChatData = await groupChatData.save()
    .catch((e) => {
      console.error('[ERROR] groupChatController updateGroupChat GroupChats groupChatData save:', e.message);
      ctx.throw(500);
    });

  analyticsManager.logEvent({
    eventType: analyticEventTypes.GROUP_CHAT_UPDATE,
    userId: groupChatId,
  })
    .catch((e) => {
      console.error('[ERROR] groupChatController updateGroupChat analyticsManager logEvent:', e.message);
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
      console.error('[ERROR] groupChatController addGroupChat GroupChats findOne:', e.message);
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
      console.error('[ERROR] groupChatController addGroupChat GroupChats groupChatData save:', e.message);
      ctx.throw(500);
    });

  analyticsManager.logEvent({
    eventType: analyticEventTypes.NEW_GROUP_CHAT,
    userId: groupChatId,
  })
    .catch((e) => {
      console.error('[ERROR] groupChatController addGroupChat analyticsManager logEvent:', e.message);
    });

  ctx.body = groupChatData;
  ctx.status = 200;
  await next();
}
