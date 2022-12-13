import htmlMinify from 'html-minifier';

export function minifyTgBot(messageTemplate) {
  return htmlMinify.minify(messageTemplate, {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    removeTagWhitespace: true,
  })
    .replaceAll('<br>', '\n');
}

export function minify(messageTemplate) {
  return htmlMinify.minify(messageTemplate, {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    removeTagWhitespace: true,
  });
}
