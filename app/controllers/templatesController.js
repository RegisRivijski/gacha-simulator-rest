import * as translatesHelper from '../helpers/translatesHelper.js';

export async function getTranslate(ctx, next) {
  const { languageCode } = ctx.request.params;
  const { t = 'replies.start' } = ctx.request.query;

  ctx.assert(languageCode, 400, 'languageCode is required');
  const $t = translatesHelper.getTranslate(languageCode);

  ctx.body = $t(t);
  ctx.status = 200;
  await next();
}
