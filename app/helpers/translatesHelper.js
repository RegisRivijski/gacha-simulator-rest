import _ from 'lodash';

import {
  AVAILABLE_DEFAULT_LANG_CODES,
  AVAILABLE_IMAGES_LANG_CODES,
} from '../constants/index.js';

import en from '../../staticData/translates/en.json' assert { type: "json" };
import uk from '../../staticData/translates/uk.json' assert { type: "json" };
import ru from '../../staticData/translates/ru.json' assert { type: "json" };

export function getDefaultLangCode() {
  if (AVAILABLE_DEFAULT_LANG_CODES.includes(global.defaultLangCode)) {
    return global.defaultLangCode;
  }
  return 'en';
}

export function validateLangCodeForImages(langCode) {
  if (AVAILABLE_IMAGES_LANG_CODES.includes(langCode)) {
    return langCode;
  }

  const defaultLangCode = getDefaultLangCode();
  if (AVAILABLE_IMAGES_LANG_CODES.includes(defaultLangCode)) {
    return defaultLangCode;
  }
  return 'en';
}

export function getTranslate(langCode) {
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
      return this.getTranslate(getDefaultLangCode());
  }
}
