const htmlMinify = require('html-minifier');

module.exports = {
  minifyTgBot(messageTemplate) {
    return htmlMinify.minify(messageTemplate, {
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      removeTagWhitespace: true,
    })
      .replaceAll('<br>', '\n');
  },
};
