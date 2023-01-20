import htmlMinify from 'html-minifier';

export function minify(messageTemplate) {
  return htmlMinify.minify(messageTemplate, {
    collapseWhitespace: true,
    removeTagWhitespace: true,
  });
}

export function minifyTgBot(messageTemplate) {
  return minify(messageTemplate)
    .replaceAll('<br>', '\n');
}
