import config from '../../config/default.js';

export async function getDefaultLangCode(ctx, next) {
  ctx.state.defaultLangCode = ctx.headers['x-default-langcode'] || config.languages.defaultLangCode;
  await next();
}
