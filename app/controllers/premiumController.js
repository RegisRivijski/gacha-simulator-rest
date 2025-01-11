import ejs from 'ejs';

import * as economy from '../constants/economy.js';

import * as analyticEventTypes from '../constants/analyticEventTypes.js';

import Translates from '../classes/Translates.js';

import * as analyticsManager from '../managers/analyticsManager.js';

import * as minify from '../helpers/minify.js';
import * as userHelper from '../helpers/usersHelper.js';
import * as timeHelper from '../helpers/timeHelper.js';
import * as premiumHelper from '../helpers/premiumHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';

export async function getTgBotPremium(ctx, next) {
  const { chatId } = ctx.request.params;

  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotPremium UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();
  const additionalData = userHelper.getAdditionalData(userData);

  let messageTemplate = await ejs.renderFile('./templates/tgBot/premium.ejs', {
    $t,
    userData,
    additionalData,
    economy,
  });

  analyticsManager.logEvent({
    eventType: analyticEventTypes.TG_PREMIUM,
    userId: userData.chatId,
  })
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotPremium analyticsManager logEvent:', e.message);
    });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: additionalData.isPremium
        ? telegramButtons.getMainLinks({
          $t,
          defaultLangCode: ctx.state.defaultLangCode,
        })
        : telegramButtons.getPremiumButtons({ $t }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function getTgBotBuyPremium(ctx, next) {
  const premiumType = Number(ctx.request.params.id);
  const { chatId } = ctx.request.params;

  ctx.assert(chatId, 400, 'chatId is required');
  ctx.assert(premiumType, 400, 'id is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotBuyPremium UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();
  const premiumData = premiumHelper.getValidPremiumTypeData({
    $t,
    premiumType,
  });

  let messageTemplate = await ejs.renderFile('./templates/tgBot/premiumBuy.ejs', {
    $t,
    userData,
    premiumData,
  });

  analyticsManager.logEvent({
    eventType: analyticEventTypes.TG_PREMIUM_BUY,
    userId: userData.chatId,
  })
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotShopItems analyticsManager logEvent:', e.message);
    });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    media: {
      invoice: premiumHelper.getInvoice({
        $t,
        messageTemplate,
        premiumData,
      }),
    },
  };
  ctx.status = 200;
  await next();
}

export async function getTgBotProceedPayment(ctx, next) {
  const premiumType = Number(ctx.request.params.id);
  const { chatId } = ctx.request.params;

  ctx.assert(chatId, 400, 'chatId is required');
  ctx.assert(premiumType, 400, 'id is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotProceedPayment UsersModel findOne:', e.message);
      ctx.throw(500);
    });
  const additionalData = userHelper.getAdditionalData(userData);

  if (additionalData.isPremium) {
    ctx.throw(400, 'user is already have premium status');
  }

  if (premiumType === economy.PREMIUM_TYPE_FOREVER) {
    userData.premiumForever = true;
  } else if (premiumType === economy.PREMIUM_TYPE_MONTH) {
    userData.premiumDate = timeHelper.addThirtyDays();
  } else {
    ctx.throw(400);
  }

  userData.save()
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotProceedPayment UsersModel save:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  let messageTemplate = await ejs.renderFile('./templates/tgBot/premiumProceed.ejs', {
    $t,
  });

  analyticsManager.logEvent({
    eventType: analyticEventTypes.TG_PREMIUM_PROCEED,
    userId: userData.chatId,
  })
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotProceedPayment analyticsManager logEvent:', e.message);
    });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
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

export async function getTgBotPremiumDaily(ctx, next) {
  const { chatId } = ctx.request.params;

  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] premiumController getTgBotBuyPremium UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();
  let additionalData = userHelper.getAdditionalData(userData);
  const isDailyCanBeReceived = timeHelper.isNextDay(userData.premiumDailyAdded);

  if (additionalData.isPremium && isDailyCanBeReceived) {
    userData.primogems += economy.PRIMOGEMS_DAILY_PREMIUM;
    userData.premiumDailyAdded = Date.now();
    additionalData = userHelper.getAdditionalData(userData);
    await userData.save()
      .catch((e) => {
        console.error('[ERROR] premiumController getTgBotPremiumDaily userData.save:', e.message);
      });

    analyticsManager.logEvent({
      eventType: analyticEventTypes.TG_PREMIUM_DAILY_RECEIVED,
      userId: userData.chatId,
    })
      .catch((e) => {
        console.error('[ERROR] premiumController getTgBotPremiumDaily analyticsManager logEvent:', e.message);
      });
  } else if (additionalData.isPremium) {
    analyticsManager.logEvent({
      eventType: analyticEventTypes.TG_PREMIUM_DAILY_ALREADY_RECEIVED,
      userId: userData.chatId,
    })
      .catch((e) => {
        console.error('[ERROR] premiumController getTgBotPremiumDaily analyticsManager logEvent:', e.message);
      });
  } else {
    analyticsManager.logEvent({
      eventType: analyticEventTypes.TG_PREMIUM_DAILY_NON_ACTIVE,
      userId: userData.chatId,
    })
      .catch((e) => {
        console.error('[ERROR] premiumController getTgBotPremiumDaily analyticsManager logEvent:', e.message);
      });
  }

  let messageTemplate = await ejs.renderFile('./templates/tgBot/premiumDaily.ejs', {
    $t,
    userData,
    additionalData,
    isDailyCanBeReceived,
    economy,
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
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
