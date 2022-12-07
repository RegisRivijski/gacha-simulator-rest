const _ = require('lodash');
const config = require('config');

const en = require('../../staticData/translates/en.json');
const uk = require('../../staticData/translates/uk.json');
const ru = require('../../staticData/translates/ru.json');

module.exports = {
  getTranslate(langCode) {
    switch (langCode) {
      case 'uk':
        return (key) => _.result(uk, key, '');
      case 'ru':
      case 'be':
        return (key) => _.result(ru, key, '');
      case 'en':
        return (key) => _.result(en, key, '');
      default:
        return this.getTranslate(config.languages.defaultLangCode);
    }
  },
};
