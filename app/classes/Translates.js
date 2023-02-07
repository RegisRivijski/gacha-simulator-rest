import _ from 'lodash';

import {
  AVAILABLE_DEFAULT_LANG_CODES,
  AVAILABLE_IMAGES_LANG_CODES,
  DEFAULT_LANG_CODE,
} from '../constants/index.js';

import en from '../../staticData/translates/en.json' assert { type: "json" };
import uk from '../../staticData/translates/uk.json' assert { type: "json" };
import ru from '../../staticData/translates/ru.json' assert { type: "json" };

export default class Translates {
  #langCode = '';

  #defaultLangCode = '';

  constructor(langCode, defaultLangCode) {
    this.#langCode = langCode;
    this.#defaultLangCode = AVAILABLE_DEFAULT_LANG_CODES.includes(defaultLangCode)
      ? defaultLangCode
      : DEFAULT_LANG_CODE;
  }

  getTranslate(__langCode) {
    const langCode = __langCode || this.#langCode;
    switch (langCode) {
      case 'uk':
        return (key) => _.result(uk, key, '');
      case 'ru':
        return (key) => _.result(ru, key, '');
      case 'id':
      case 'ko':
      case 'zh-hans':
      case 'en':
        return (key) => _.result(en, key, '');
      default:
        return this.getTranslate(this.#defaultLangCode);
    }
  }

  validateLangCodeForImages() {
    if (AVAILABLE_IMAGES_LANG_CODES.includes(this.#langCode)) {
      return this.#langCode;
    }
    if (AVAILABLE_IMAGES_LANG_CODES.includes(this.#defaultLangCode)) {
      return this.#defaultLangCode;
    }
    return DEFAULT_LANG_CODE;
  }
}
