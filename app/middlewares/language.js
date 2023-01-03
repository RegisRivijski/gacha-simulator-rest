export async function getDefaultLangCode(ctx, next) {
  const defaultLangCode = ctx.headers['x-default-langcode'] || global.CONFIG.languages.defaultLangCode;
  global.defaultLangCode = defaultLangCode;
  ctx.state.defaultLangCode = defaultLangCode;
  await next();
}
