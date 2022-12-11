const _ = require('lodash');

const {
  AVAILABLE_DEFAULT_LANG_CODES,
} = require('../constants/index');

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
      case 'id':
      case 'en':
        return (key) => _.result(en, key, '');
      default:
        if (AVAILABLE_DEFAULT_LANG_CODES.includes(global.defaultLangCode)) {
          return this.getTranslate(global.defaultLangCode);
        }
        return this.getTranslate('en');
    }
  },
};
