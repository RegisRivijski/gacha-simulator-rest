import * as userHelper from '../helpers/usersHelper.js';
import * as translatesHelper from '../helpers/translatesHelper.js';

export async function start(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] mainController start UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const $t = translatesHelper.getTranslate(languageCode);

  ctx.body = {

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
  const $t = translatesHelper.getTranslate(languageCode);

  ctx.body = {

  };
  ctx.status = 200;
  await next();
}

export async function settings(ctx, next) {
  const { chatId } = ctx.request.params;
  ctx.assert(chatId, 400, 'chatId is required');

  const userData = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] mainController settings UsersModel findOne:', e.message);
      ctx.throw(500);
    });

  const { languageCode } = userData;
  const $t = translatesHelper.getTranslate(languageCode);

  ctx.body = {

  };
  ctx.status = 200;
  await next();
}
