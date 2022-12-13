import _ from 'lodash';

import {
  AVAILABLE_DEFAULT_LANG_CODES,
} from '../constants/index.js';

import en from '../../staticData/translates/en.json' assert { type: "json" };
import uk from '../../staticData/translates/uk.json' assert { type: "json" };
import ru from '../../staticData/translates/ru.json' assert { type: "json" };

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
      if (AVAILABLE_DEFAULT_LANG_CODES.includes(global.defaultLangCode)) {
        return this.getTranslate(global.defaultLangCode);
      }
      return this.getTranslate('en');
  }
}
