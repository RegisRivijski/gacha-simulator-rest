const {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
} = require('../constants/index');

const banners = require('../../staticData/data/banners/banners.json');

const charactersEn = require('../../staticData/data/items/en/characters.json');
const charactersRu = require('../../staticData/data/items/ru/characters.json');
const charactersId = require('../../staticData/data/items/id/characters.json');
const charactersKo = require('../../staticData/data/items/ko/characters.json');
const charactersZhHans = require('../../staticData/data/items/zh-hans/characters.json');

const weaponsEn = require('../../staticData/data/items/en/weapons.json');
const weaponsRu = require('../../staticData/data/items/ru/weapons.json');
const weaponsId = require('../../staticData/data/items/id/weapons.json');
const weaponsKo = require('../../staticData/data/items/ko/weapons.json');
const weaponsZhHans = require('../../staticData/data/items/zh-hans/weapons.json');

const chancesEventGuarantee = require('../../staticData/data/chances/eventGuarantee.json');
const chancesType = require('../../staticData/data/chances/type.json');

const chancesCharactersBanner = require('../../staticData/data/chances/standard.json');
const chancesWeaponsBanner = require('../../staticData/data/chances/weapon.json');

const fatesPrices = require('../../staticData/data/prices/fates.json');

module.exports = {
  getBanners() {
    return banners;
  },

  getItems({ langCode, type }) {
    let result = {};
    switch (type) {
      case TYPE_CHARACTERS_NAME:
        switch (langCode) {
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
          default:
            result = charactersEn;
        }
        break;
      case TYPE_WEAPONS_NAME:
        switch (langCode) {
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
          default:
            result = weaponsEn;
        }
        break;
      default:
    }
    return result;
  },

  getChancesType() {
    return chancesType;
  },

  getChancesEventGuarantee() {
    return chancesEventGuarantee;
  },

  getChancesBanner(type) {
    switch (type) {
      case WEAPONS_BANNER_TYPE_NAME:
        return chancesWeaponsBanner;
      case STANDARD_BANNER_TYPE_NAME:
      case CHARACTERS_BANNER_TYPE_NAME:
      default:
        return chancesCharactersBanner;
    }
  },

  getFatesPrices() {
    return fatesPrices;
  },
};
