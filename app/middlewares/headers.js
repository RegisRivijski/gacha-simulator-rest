import config from '../../config/default.js';

export async function getDefaultLangCode(ctx, next) {
  ctx.state.defaultLangCode = ctx.headers['x-default-langcode'] || config.languages.defaultLangCode;
  await next();
}

export async function getIsAction(ctx, next) {
  ctx.state.isAction = ctx.headers['x-is-action'] === 'true';
  await next();
}

export async function getAuthorization(ctx, next) {
  ctx.state.authorization = ctx.headers.Authorization;
  await next();
}
