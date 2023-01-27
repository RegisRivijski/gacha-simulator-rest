import Translates from '../classes/Translates.js';

import * as userHelper from '../helpers/usersHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';

export async function start(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] mainController start UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  ctx.body = {
    messageTemplate: $t('replies.start'),
  };
  ctx.status = 200;
  await next();
}

export async function help(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] mainController help UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  ctx.body = {
    messageTemplate: $t('replies.help'),
  };
  ctx.status = 200;
  await next();
}

export async function settings(ctx, next) {
  const { chatId } = ctx.request.params;
  const { isAction } = ctx.state;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] mainController settings UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  const languages = [
    {
      name: 'Русский язык',
      code: 'ru',
    },
    {
      name: 'Українська мова 🇺🇦',
      code: 'uk',
    },
    {
      name: 'English 🏴',
      code: 'en',
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

  ctx.body = {
    userData,
    messageTemplate: $t('replies.help'),
    media: {
      mediaMarkupButtons: telegramButtons.getSettingsButtons({
        chatId,
        languages,
      }),
    },
    updateMessage: isAction,
  };
  ctx.status = 200;
  await next();
}
