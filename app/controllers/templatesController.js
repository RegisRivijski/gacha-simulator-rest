import Translates from '../classes/Translates.js';

export async function getTranslate(ctx, next) {
  const { languageCode } = ctx.request.params;
  const { t = 'replies.start' } = ctx.request.query;

  ctx.assert(languageCode, 400, 'languageCode is required');
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  ctx.body = $t(t);
  ctx.status = 200;
  await next();
}
