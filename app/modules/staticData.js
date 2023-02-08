import {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
  AVAILABLE_ITEMS_LANG_CODES,
} from '../constants/index.js';

import banners from '../../staticData/data/banners/banners.json' assert { type: "json" };

import charactersEn from '../../staticData/data/items/en/characters.json' assert { type: "json" };
import charactersRu from '../../staticData/data/items/ru/characters.json' assert { type: "json" };
import charactersId from '../../staticData/data/items/id/characters.json' assert { type: "json" };
import charactersKo from '../../staticData/data/items/ko/characters.json' assert { type: "json" };
import charactersZhHans from '../../staticData/data/items/zh-hans/characters.json' assert { type: "json" };

import weaponsEn from '../../staticData/data/items/en/weapons.json' assert { type: "json" };
import weaponsRu from '../../staticData/data/items/ru/weapons.json' assert { type: "json" };
import weaponsId from '../../staticData/data/items/id/weapons.json' assert { type: "json" };
import weaponsKo from '../../staticData/data/items/ko/weapons.json' assert { type: "json" };
import weaponsZhHans from '../../staticData/data/items/zh-hans/weapons.json' assert { type: "json" };

import chancesEventGuarantee from '../../staticData/data/chances/eventGuarantee.json' assert { type: "json" };
import chancesType from '../../staticData/data/chances/type.json' assert { type: "json" };
import chancesCharactersBanner from '../../staticData/data/chances/standard.json' assert { type: "json" };
import chancesWeaponsBanner from '../../staticData/data/chances/weapon.json' assert { type: "json" };

import fatesPrices from '../../staticData/data/prices/fates.json' assert { type: "json" };

export function getBanners() {
  return banners;
}

export function getCharactersItems({
  languageCode,
  defaultLangCode,
}) {
  let result = {};
  switch (languageCode) {
    case 'ru':
      result = charactersRu;
      break;
    case 'id':
      result = charactersId;
      break;
    case 'ko':
      result = charactersKo;
      break;
    case 'zh-hans':
      result = charactersZhHans;
      break;
    case 'en':
      result = charactersEn;
      break;
    default:
      if (AVAILABLE_ITEMS_LANG_CODES.includes(defaultLangCode)) {
        result = getCharactersItems({
          languageCode: defaultLangCode,
        });
      } else {
        result = charactersEn;
      }
  }
  return result;
}

export function getWeaponsItems({
  languageCode,
  defaultLangCode,
}) {
  let result = {};
  switch (languageCode) {
    case 'ru':
      result = weaponsRu;
      break;
    case 'id':
      result = weaponsId;
      break;
    case 'ko':
      result = weaponsKo;
      break;
    case 'zh-hans':
      result = weaponsZhHans;
      break;
    case 'en':
      result = weaponsEn;
      break;
    default:
      if (AVAILABLE_ITEMS_LANG_CODES.includes(defaultLangCode)) {
        result = getWeaponsItems({
          languageCode: defaultLangCode,
        });
      } else {
        result = weaponsEn;
      }
  }
  return result;
}

export function getItems({
  languageCode,
  defaultLangCode,
  type,
}) {
  let result = {};
  switch (type) {
    case TYPE_CHARACTERS_NAME:
      result = getCharactersItems({
        languageCode,
        defaultLangCode,
      });
      break;
    case TYPE_WEAPONS_NAME:
      result = getWeaponsItems({
        languageCode,
        defaultLangCode,
      });
      break;
    default:
  }
  return result;
}

export function getChancesType() {
  return chancesType;
}

export function getChancesEventGuarantee() {
  return chancesEventGuarantee;
}

export function getChancesBanner(type) {
  switch (type) {
    case WEAPONS_BANNER_TYPE_NAME:
      return chancesWeaponsBanner;
    case STANDARD_BANNER_TYPE_NAME:
    case CHARACTERS_BANNER_TYPE_NAME:
    default:
      return chancesCharactersBanner;
  }
}

export function getFatesPrices() {
  return fatesPrices;
}
