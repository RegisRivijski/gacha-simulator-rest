import config from '../../config/default.js';

export async function getDefaultLangCode(ctx, next) {
  const defaultLangCode = ctx.headers['x-default-langcode'] || config.languages.defaultLangCode;
  global.defaultLangCode = defaultLangCode;
  ctx.state.defaultLangCode = defaultLangCode;
  await next();
}
