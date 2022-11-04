const _ = require('lodash');

const {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
  STANDARD_BANNER_NAME,
  EVENT_BANNER_CATEGORY_NAME,
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
  UNIVERSAL_BANNER_CATEGORY_NAME,
} = require('../constants/index');

const bannersHelper = require('./bannersHelper');
const itemsHelper = require('./itemsHelper');
const randomizeHelper = require('./randomizeHelper');
const usersHelper = require('./usersHelper');
const staticDataHelper = require('./staticDataHelper');

const standardBannerData = bannersHelper.getBannerData(STANDARD_BANNER_NAME);
const chancesType = staticDataHelper.getChancesType();
const chancesEventGuarantee = staticDataHelper.getChancesEventGuarantee();

module.exports = {
  getNewItems(userData) {
    const currentBannerData = bannersHelper.getBannerData(userData.currentBanner);
    const currentBannerType = _.result(currentBannerData, 'type', STANDARD_BANNER_TYPE_NAME);
    const currentBannerCategory = _.result(currentBannerData, 'category', EVENT_BANNER_CATEGORY_NAME);

    const currentDropChances = bannersHelper.calculateDropChances({
      type: currentBannerData.type,
      fourStar: _.result(userData, [currentBannerData.type, 'fourStar'], 0),
      fiveStar: _.result(userData, [currentBannerData.type, 'fiveStar'], 0),
    });

    const newItemRarity = randomizeHelper.getRandomItemByChances(currentDropChances);
    const newItemType = randomizeHelper.getRandomItemByChances(chancesType);
    const newItemIsEvent = usersHelper.getEventGuarantee(userData, currentBannerType, newItemRarity)
      || randomizeHelper.getRandomItemByChances(chancesEventGuarantee);

    switch (currentBannerCategory) {
      case EVENT_BANNER_CATEGORY_NAME:
        switch (currentBannerType) {
          case STANDARD_BANNER_TYPE_NAME:
            return this.eventStandardBanner({ newItemRarity, newItemType });
          case CHARACTERS_BANNER_TYPE_NAME:
            return this.eventCharactersBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent });
          case WEAPONS_BANNER_TYPE_NAME:
            return this.eventWeaponsBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent });
          default:
        }
        break;
      case UNIVERSAL_BANNER_CATEGORY_NAME:
        switch (currentBannerType) {
          case CHARACTERS_BANNER_TYPE_NAME:
            return this.universalCharactersBanner({ newItemRarity, newItemType });
          case WEAPONS_BANNER_TYPE_NAME:
            return this.universalWeaponsBanner({ newItemRarity, newItemType });
          default:
        }
        break;
      default:
    }

    return {
      newItems: [],
      newItemType,
      newItemRarity,
    };
  },

  eventStandardBanner({ newItemRarity, newItemType }) {
    switch (newItemRarity) {
      case 3:
        return {
          newItems: standardBannerData.weapons['3'],
          newItemType: TYPE_WEAPONS_NAME,
          newItemRarity,
        };
      case 4:
        return {
          newItems: standardBannerData[newItemType]['4'],
          newItemType,
          newItemRarity,
        };
      case 5:
        return {
          newItems: standardBannerData[newItemType]['5'],
          newItemType,
          newItemRarity,
        };
      default:
        return {
          newItems: [],
          newItemType,
          newItemRarity,
        };
    }
  },

  eventCharactersBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent }) {
    switch (newItemRarity) {
      case 3:
        return {
          newItems: standardBannerData.weapons['3'],
          newItemType: TYPE_WEAPONS_NAME,
          newItemRarity,
          newItemIsEvent,
        };
      case 4:
        return {
          newItems: newItemIsEvent ? currentBannerData.characters['4'] : standardBannerData[newItemType]['4'],
          newItemType: newItemIsEvent ? newItemType : TYPE_CHARACTERS_NAME,
          newItemRarity,
          newItemIsEvent,
        };
      case 5:
        return {
          newItems: newItemIsEvent ? currentBannerData.characters['5'] : standardBannerData.characters['5'],
          newItemType: TYPE_CHARACTERS_NAME,
          newItemRarity,
          newItemIsEvent,
        };
      default:
        return {
          newItems: [],
          newItemType,
          newItemRarity,
          newItemIsEvent,
        };
    }
  },

  eventWeaponsBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent }) {
    switch (newItemRarity) {
      case 3:
        return {
          newItems: standardBannerData.weapons['3'],
          newItemType: TYPE_WEAPONS_NAME,
          newItemRarity,
          newItemIsEvent,
        };
      case 4:
        return {
          newItems: newItemIsEvent ? currentBannerData.weapons['4'] : standardBannerData[newItemType]['4'],
          newItemType: newItemIsEvent ? TYPE_WEAPONS_NAME : newItemType,
          newItemRarity,
          newItemIsEvent,
        };
      case 5:
        return {
          newItems: newItemIsEvent ? currentBannerData.weapons['5'] : standardBannerData.weapons['5'],
          newItemType: TYPE_WEAPONS_NAME,
          newItemRarity,
          newItemIsEvent,
        };
      default:
        return {
          newItems: [],
          newItemType,
          newItemRarity,
          newItemIsEvent,
        };
    }
  },

  universalCharactersBanner({ newItemRarity, newItemType }) {
    switch (newItemRarity) {
      case 3:
        return {
          newItems: itemsHelper.getItemsByTypeAndRarity({ type: TYPE_WEAPONS_NAME, rarity: newItemRarity })
            .map(({ objKey }) => objKey),
          newItemType: TYPE_WEAPONS_NAME,
          newItemRarity,
        };
      case 4:
        return {
          newItems: itemsHelper.getItemsByTypeAndRarity({ type: newItemType, rarity: newItemRarity })
            .map(({ objKey }) => objKey),
          newItemType,
          newItemRarity,
        };
      case 5:
        return {
          newItems: itemsHelper.getItemsByTypeAndRarity({ type: TYPE_CHARACTERS_NAME, rarity: newItemRarity })
            .map(({ objKey }) => objKey),
          newItemType: TYPE_CHARACTERS_NAME,
          newItemRarity,
        };
      default:
        return {
          newItems: [],
          newItemType,
          newItemRarity,
        };
    }
  },

  universalWeaponsBanner({ newItemRarity, newItemType }) {
    switch (newItemRarity) {
      case 3:
      case 5:
        return {
          newItems: itemsHelper.getItemsByTypeAndRarity({ type: TYPE_WEAPONS_NAME, rarity: newItemRarity })
            .map(({ objKey }) => objKey),
          newItemType: TYPE_WEAPONS_NAME,
          newItemRarity,
        };
      case 4:
        return {
          newItems: itemsHelper.getItemsByTypeAndRarity({ type: newItemType, rarity: newItemRarity })
            .map(({ objKey }) => objKey),
          newItemType,
          newItemRarity,
        };
      default:
        return {
          newItems: [],
          newItemType,
          newItemRarity,
        };
    }
  },
};
