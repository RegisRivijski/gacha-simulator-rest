import ejs from 'ejs';
import {
  MEDIA_TYPE_PHOTO,
} from '../constants/index.js';

import Translates from '../classes/Translates.js';

import * as userHelper from '../helpers/usersHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';
import * as minify from '../helpers/minify.js';
import * as linksHelper from '../helpers/linksHelper.js';

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

  const mediaType = MEDIA_TYPE_PHOTO;
  const media = linksHelper.getLinkForStart();

  ctx.body = {
    userData,
    messageTemplate: $t('replies.start'),
    media: {
      media,
      mediaType,
    },
    messageAfterMedia: true,
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
    userData,
    messageTemplate: $t('replies.help'),
  };
  ctx.status = 200;
  await next();
}

export async function settings(ctx, next) {
  const { chatId } = ctx.request.params;
  const { isAction } = ctx.state;
  ctx.assert(chatId, 400, 'chatId is required');

  const { languageCodeSettings } = ctx.request.query;

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] mainController settings UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  if (languageCodeSettings) {
    userData.languageCode = languageCodeSettings;
    userData.save()
      .catch((e) => {
        console.error('[ERROR] mainController settings UsersModel save:', e.message);
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
      name: 'English 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: telegramButtons.getSettingsButtons({
        chatId,
        languages,
        languageCode,
      }),
    },
    updateMessage: isAction,
  };
  ctx.status = 200;
  await next();
}
