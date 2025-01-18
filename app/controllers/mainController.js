import ejs from 'ejs';
import {
  MEDIA_TYPE_PHOTO,
} from '../constants/index.js';
import {
  PRIMOGEMS_REFERRAL_REWARD,
} from '../constants/economy.js';

import * as analyticEventTypes from '../constants/analyticEventTypes.js';

import AnalyticService from '../classes/ActionServices/AnalyticService.js';
import LoggerService from '../classes/ActionServices/LoggerService.js';
import Translates from '../classes/Translates.js';

import UsersModel from '../models/genshinImpactTgBot/users.js';

import * as userHelper from '../helpers/usersHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';
import * as minify from '../helpers/minify.js';
import * as linksHelper from '../helpers/linksHelper.js';
import * as inventoryHelper from '../helpers/inventoryHelper.js';

export async function start(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData, created } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('mainController start UsersModel findOne:', e);
      ctx.throw(500);
    });

  if (created) {
    AnalyticService.logEvent({
      eventType: analyticEventTypes.NEW_USER,
      userId: userData.chatId,
    })
      .catch((e) => {
        LoggerService.error('userController start AnalyticService logEvent:', e);
      });
  }

  const userByBotData = await userHelper.getUserByBot(chatId, ctx.state.defaultLangCode)
    .catch((e) => {
      LoggerService.error('mainController start getUserByBot:', e);
    });

  if (userByBotData?.isActive !== undefined && !userData.isActive) {
    userByBotData.isActive = true;
    await userByBotData.save()
      .catch((e) => {
        LoggerService.error('mainController start getUserByBot save:', e);
      });

    AnalyticService.logEvent({
      eventType: analyticEventTypes.USER_RETURNED,
      userId: userData.chatId,
    })
      .catch((e) => {
        LoggerService.error('userController start AnalyticService logEvent:', e);
      });
  }

  let { startData } = ctx.query;
  if (startData) {
    try {
      startData = JSON.parse(atob(startData));

      if (created && startData.referralInviteChatId) {
        const invitedUserData = await UsersModel.findOne({
          chatId: startData.referralInviteChatId,
        })
          .catch((e) => {
            LoggerService.error('mainController start UsersModel.findOne():', e);
          });

        invitedUserData.primogems += PRIMOGEMS_REFERRAL_REWARD;
        invitedUserData.save()
          .catch((e) => {
            LoggerService.error('mainController start invitedUserData.save():', e);
          });

        userData.primogems += PRIMOGEMS_REFERRAL_REWARD;
        userData.save()
          .catch((e) => {
            LoggerService.error('mainController start userData.save():', e);
          });

        AnalyticService.logEvent({
          eventType: analyticEventTypes.TG_START_REFERRAL_ADDED,
          userId: userData.chatId,
        })
          .catch((e) => {
            LoggerService.error('mainController start AnalyticService logEvent:', e);
          });
      }
    } catch (e) {
      LoggerService.error('mainController start JSON.parse(startData)', e);
    }
  } else {
    AnalyticService.logEvent({
      eventType: analyticEventTypes.TG_START,
      userId: userData.chatId,
    })
      .catch((e) => {
        LoggerService.error('mainController start AnalyticService logEvent:', e);
      });
  }

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const mediaType = MEDIA_TYPE_PHOTO;
  const media = linksHelper.getLinkForStart();

  ctx.body = {
    userData,
    messageTemplate: $t('replies.start'),
    media: {
      media,
      mediaType,
      mediaMarkupButtons: telegramButtons.getMainLinks({
        $t,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    },
    messageAfterMedia: true,
  };
  ctx.status = 200;
  await next();
}

export async function help(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('mainController help UsersModel findOne:', e);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  AnalyticService.logEvent({
    eventType: analyticEventTypes.TG_HELP,
    userId: userData.chatId,
  })
    .catch((e) => {
      LoggerService.error('mainController start AnalyticService logEvent:', e);
    });

  ctx.body = {
    userData,
    messageTemplate: $t('replies.help'),
    media: {
      mediaMarkupButtons: telegramButtons.getMainLinks({
        $t,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function settings(ctx, next) {
  const { chatId } = ctx.request.params;
  const { isAction } = ctx.state;
  ctx.assert(chatId, 400, 'chatId is required');

  const {
    languageCodeSettings,
    gifEnable,
    notificationsEnable,
  } = ctx.request.query;
  let {
    clearState,
  } = ctx.request.query;

  clearState = Number(clearState) || 0;

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('mainController settings UsersModel findOne:', e);
      ctx.throw(500);
    });

  let deletedCount = 0;

  if (languageCodeSettings) {
    userData.languageCode = languageCodeSettings;
  }

  if (gifEnable) {
    userData.gifEnable = gifEnable === 'true';
  }

  if (notificationsEnable) {
    userData.notificationsEnable = notificationsEnable === 'true';
  }

  if (clearState > 2) {
    try {
      deletedCount = await inventoryHelper.removeAllItemsByChatId(chatId);
      clearState = 0;
    } catch (e) {
      LoggerService.error('mainController settings removeAllItemsByChatId:', e);
    }
  }

  if (
    languageCodeSettings
    || gifEnable
    || notificationsEnable
  ) {
    await userData.save()
      .catch((e) => {
        LoggerService.error('mainController settings UsersModel save:', e);
      });
  }

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const languages = [
    {
      name: 'Українська мова 🇺🇦',
      code: 'uk',
    },
    {
      name: 'English 🏴',
      code: 'en',
    },
    {
      name: 'Русский язык',
      code: 'ru',
    },
    {
      name: 'bahasa Indonesia 🇮🇩',
      code: 'id',
    },
    {
      name: '한국인 🇰🇷',
      code: 'ko',
    },
    {
      name: '简体中文 🇨🇳',
      code: 'zh-hans',
    },
  ];

  let messageTemplate = await ejs.renderFile('./templates/tgBot/settings.ejs', {
    $t,
    userData,
    deletedCount,
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: telegramButtons.getSettingsButtons({
        $t,
        chatId,
        userData,
        languages,
        languageCode,
        defaultLangCode: ctx.state.defaultLangCode,
        clearState,
      }),
    },
    updateMessage: isAction,
  };
  ctx.status = 200;
  await next();
}

export async function support(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('mainController support UsersModel findOne:', e);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  AnalyticService.logEvent({
    eventType: analyticEventTypes.TG_HELP,
    userId: userData.chatId,
  })
    .catch((e) => {
      LoggerService.error('mainController support AnalyticService logEvent:', e);
    });

  ctx.body = {
    userData,
    messageTemplate: $t('replies.support'),
    media: {
      mediaMarkupButtons: telegramButtons.getMainLinks({
        $t,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function terms(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      LoggerService.error('mainController terms UsersModel findOne:', e);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  AnalyticService.logEvent({
    eventType: analyticEventTypes.TG_HELP,
    userId: userData.chatId,
  })
    .catch((e) => {
      LoggerService.error('mainController terms AnalyticService logEvent:', e);
    });

  ctx.body = {
    userData,
    messageTemplate: $t('replies.terms'),
    media: {
      mediaMarkupButtons: telegramButtons.getMainLinks({
        $t,
        defaultLangCode: ctx.state.defaultLangCode,
      }),
    },
  };
  ctx.status = 200;
  await next();
}
