const {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
} = require('../constants/index');

const banners = require('../../data/banners/banners.json');

const charactersEn = require('../../data/items/en/characters.json');
const charactersRu = require('../../data/items/ru/characters.json');
const charactersId = require('../../data/items/id/characters.json');
const charactersKo = require('../../data/items/ko/characters.json');
const charactersZhHans = require('../../data/items/zh-hans/characters.json');

const weaponsEn = require('../../data/items/en/weapons.json');
const weaponsRu = require('../../data/items/ru/weapons.json');
const weaponsId = require('../../data/items/id/weapons.json');
const weaponsKo = require('../../data/items/ko/weapons.json');
const weaponsZhHans = require('../../data/items/zh-hans/weapons.json');

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
};
