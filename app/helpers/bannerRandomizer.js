import _ from 'lodash';

import {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
  STANDARD_BANNER_NAME,
  EVENT_BANNER_CATEGORY_NAME,
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
  UNIVERSAL_BANNER_CATEGORY_NAME,
} from '../constants/index.js';

import * as bannersHelper from './bannersHelper.js';
import * as itemsHelper from './itemsHelper.js';
import * as randomizeHelper from './randomizeHelper.js';
import * as usersHelper from './usersHelper.js';
import * as staticData from '../modules/staticData.js';

const standardBannerData = bannersHelper.getBannerData(STANDARD_BANNER_NAME);
const chancesType = staticData.getChancesType();
const chancesEventGuarantee = staticData.getChancesEventGuarantee();

export function eventStandardBanner({ newItemRarity, newItemType }) {
  switch (newItemRarity) {
    case 3:
      return {
        possibleNewItems: standardBannerData.weapons['3'],
        newItemType: TYPE_WEAPONS_NAME,
        newItemRarity,
      };
    case 4:
      return {
        possibleNewItems: standardBannerData[newItemType]['4'],
        newItemType,
        newItemRarity,
      };
    case 5:
      return {
        possibleNewItems: standardBannerData[newItemType]['5'],
        newItemType,
        newItemRarity,
      };
    default:
      return {
        possibleNewItems: [],
        newItemType,
        newItemRarity,
      };
  }
}

export function eventCharactersBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent }) {
  switch (newItemRarity) {
    case 3:
      return {
        possibleNewItems: standardBannerData.weapons['3'],
        newItemType: TYPE_WEAPONS_NAME,
        newItemRarity,
        newItemIsEvent,
      };
    case 4:
      return {
        possibleNewItems: newItemIsEvent ? currentBannerData.characters['4'] : standardBannerData[newItemType]['4'],
        newItemType: newItemIsEvent ? TYPE_CHARACTERS_NAME : newItemType,
        newItemRarity,
        newItemIsEvent,
      };
    case 5:
      return {
        possibleNewItems: newItemIsEvent ? currentBannerData.characters['5'] : standardBannerData.characters['5'],
        newItemType: TYPE_CHARACTERS_NAME,
        newItemRarity,
        newItemIsEvent,
      };
    default:
      return {
        possibleNewItems: [],
        newItemType,
        newItemRarity,
        newItemIsEvent,
      };
  }
}

export function eventWeaponsBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent }) {
  switch (newItemRarity) {
    case 3:
      return {
        possibleNewItems: standardBannerData.weapons['3'],
        newItemType: TYPE_WEAPONS_NAME,
        newItemRarity,
        newItemIsEvent,
      };
    case 4:
      return {
        possibleNewItems: newItemIsEvent ? currentBannerData.weapons['4'] : standardBannerData[newItemType]['4'],
        newItemType: newItemIsEvent ? TYPE_WEAPONS_NAME : newItemType,
        newItemRarity,
        newItemIsEvent,
      };
    case 5:
      return {
        possibleNewItems: newItemIsEvent ? currentBannerData.weapons['5'] : standardBannerData.weapons['5'],
        newItemType: TYPE_WEAPONS_NAME,
        newItemRarity,
        newItemIsEvent,
      };
    default:
      return {
        possibleNewItems: [],
        newItemType,
        newItemRarity,
        newItemIsEvent,
      };
  }
}

export function universalCharactersBanner({ newItemRarity, newItemType }) {
  switch (newItemRarity) {
    case 3:
      return {
        possibleNewItems: itemsHelper.getItemsByTypeAndRarity({ type: TYPE_WEAPONS_NAME, rarity: newItemRarity })
          .map(({ objKey }) => objKey),
        newItemType: TYPE_WEAPONS_NAME,
        newItemRarity,
      };
    case 4:
      return {
        possibleNewItems: itemsHelper.getItemsByTypeAndRarity({ type: newItemType, rarity: newItemRarity })
          .map(({ objKey }) => objKey),
        newItemType,
        newItemRarity,
      };
    case 5:
      return {
        possibleNewItems: itemsHelper.getItemsByTypeAndRarity({ type: TYPE_CHARACTERS_NAME, rarity: newItemRarity })
          .map(({ objKey }) => objKey),
        newItemType: TYPE_CHARACTERS_NAME,
        newItemRarity,
      };
    default:
      return {
        possibleNewItems: [],
        newItemType,
        newItemRarity,
      };
  }
}

export function universalWeaponsBanner({ newItemRarity, newItemType }) {
  switch (newItemRarity) {
    case 3:
    case 5:
      return {
        possibleNewItems: itemsHelper.getItemsByTypeAndRarity({ type: TYPE_WEAPONS_NAME, rarity: newItemRarity })
          .map(({ objKey }) => objKey),
        newItemType: TYPE_WEAPONS_NAME,
        newItemRarity,
      };
    case 4:
      return {
        possibleNewItems: itemsHelper.getItemsByTypeAndRarity({ type: newItemType, rarity: newItemRarity })
          .map(({ objKey }) => objKey),
        newItemType,
        newItemRarity,
      };
    default:
      return {
        possibleNewItems: [],
        newItemType,
        newItemRarity,
      };
  }
}

export function getNewItems(userData) {
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
  const newItemIsEvent = Boolean(usersHelper.getEventGuarantee(userData, currentBannerType, newItemRarity))
    || Boolean(randomizeHelper.getRandomItemByChances(chancesEventGuarantee));

  switch (currentBannerCategory) {
    case EVENT_BANNER_CATEGORY_NAME:
      switch (currentBannerType) {
        case STANDARD_BANNER_TYPE_NAME:
          return eventStandardBanner({ newItemRarity, newItemType });
        case CHARACTERS_BANNER_TYPE_NAME:
          return eventCharactersBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent });
        case WEAPONS_BANNER_TYPE_NAME:
          return eventWeaponsBanner({ currentBannerData, newItemRarity, newItemType, newItemIsEvent });
        default:
      }
      break;
    case UNIVERSAL_BANNER_CATEGORY_NAME:
      switch (currentBannerType) {
        case CHARACTERS_BANNER_TYPE_NAME:
          return universalCharactersBanner({ newItemRarity, newItemType });
        case WEAPONS_BANNER_TYPE_NAME:
          return universalWeaponsBanner({ newItemRarity, newItemType });
        default:
      }
      break;
    default:
  }

  return {
    possibleNewItems: [],
    newItemType,
    newItemRarity,
  };
}
