const _ = require('lodash');

const en = require('../../translates/en.json');
const uk = require('../../translates/uk.json');
const ru = require('../../translates/ru.json');

module.exports = {
  getTranslate(langCode) {
    switch (langCode) {
      case 'uk':
        return (key) => _.result(uk, key, '');
      case 'ru':
      case 'be':
        return (key) => _.result(ru, key, '');
      case 'en':
      default:
        return (key) => _.result(en, key, '');
    }
  },
};
