import htmlMinify from 'html-minifier';

export function minifyTgBot(messageTemplate) {
  return htmlMinify.minify(messageTemplate, {
    collapseWhitespace: true,
    removeTagWhitespace: true,
  })
    .replaceAll('<br>', '\n');
}

export function minify(messageTemplate) {
  return htmlMinify.minify(messageTemplate, {
    collapseWhitespace: true,
    removeTagWhitespace: true,
  });
}
