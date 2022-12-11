const config = require('config');

module.exports = {
  async getDefaultLangCode(ctx, next) {
    const defaultLangCode = ctx.headers['x-default-langcode'] || config.languages.defaultLangCode;
    global.defaultLangCode = defaultLangCode;
    ctx.state.defaultLangCode = defaultLangCode;
    await next();
  },
};
