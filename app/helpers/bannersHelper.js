import _ from 'lodash';

import {
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
  STANDARD_BANNER_TYPE_NAME,

  EVENT_BANNER_CATEGORY_NAME,
  UNIVERSAL_BANNER_CATEGORY_NAME,

  TYPE_WEAPONS_NAME,
  TYPE_CHARACTERS_NAME,
} from '../constants/index.js';

import * as staticData from '../modules/staticData.js';
import * as itemsHelper from './itemsHelper.js';

const banners = staticData.getBanners();
const bannersPrices = staticData.getFatesPrices();
const bannersArray = Object.values(banners);

export function getActiveBanners() {
  return bannersArray.filter((banner) => {
    const { isActive } = banner;
    return isActive;
  });
}

export function getActiveEventBanners() {
  return bannersArray.filter((banner) => {
    const { isActive, category } = banner;
    return isActive && category === EVENT_BANNER_CATEGORY_NAME;
  });
}

export function getActiveUniversalBanners() {
  return bannersArray.filter((banner) => {
    const { isActive, category } = banner;
    return isActive && category === UNIVERSAL_BANNER_CATEGORY_NAME;
  });
}

export const allActiveBanners = [
  ...getActiveEventBanners(),
  ...getActiveUniversalBanners(),
];

export function getBannerData(objKey) {
  return _.result(banners, objKey, {});
}

export function getBannerPrices(type) {
  return _.result(bannersPrices, type, {});
}

export function getBannerName({
  currentBanner,
  languageCode,
  defaultLangCode,
}) {
  const currentBannerData = getBannerData(currentBanner);
  const bannerNames = _.result(currentBannerData, 'translates', {});
  switch (languageCode) {
    case 'en':
      return _.result(bannerNames, 'en', '');
    case 'id':
      return _.result(bannerNames, 'id', '');
    case 'ko':
      return _.result(bannerNames, 'ko', '');
    case 'ru':
      return _.result(bannerNames, 'ru', '');
    case 'zh-hans':
      return _.result(bannerNames, 'zh-hans', '');
    default:
      if (Object.keys(bannerNames).includes(defaultLangCode)) {
        return _.result(bannerNames, defaultLangCode, '');
      }
      return _.result(bannerNames, 'en', '');
  }
}

export function calculateDropChances({ type = '', fourStar = 0, fiveStar = 0 }) {
  const bannerChances = staticData.getChancesBanner(type);

  const fiveStarIsDefault = fiveStar < Number(bannerChances.fiveStar.defaultTo);
  const fourStarIsDefault = fourStar < Number(bannerChances.fourStar.defaultTo);

  const fiveStarChance = fiveStarIsDefault
    ? bannerChances.fiveStar.default
    : bannerChances.fiveStar[String(fiveStar)];

  const fourStarChance = fourStarIsDefault
    ? bannerChances.fourStar.default
    : bannerChances.fourStar[String(fourStar)];

  return [
    {
      item: 5,
      chance: (fourStarChance !== 1000) ? fiveStarChance : 0,
      toGuarantee: bannerChances.fiveStar.guarantee - fiveStar,
    },
    {
      item: 4,
      chance: (fiveStarChance !== 1000) ? fourStarChance : 0,
      toGuarantee: bannerChances.fourStar.guarantee - fourStar,
    },
    {
      item: 3,
      chance: (fiveStarChance !== 1000 && fourStarChance !== 1000)
        ? 1000 - fourStarChance - fiveStarChance
        : 0,
    },
  ];
}

export function getNextBanner(currentBanner) {
  const currentActiveIndex = allActiveBanners
    .findIndex((el) => el.objKey === currentBanner);
  if (currentActiveIndex >= allActiveBanners.length - 1) {
    return allActiveBanners[0].objKey;
  }
  return allActiveBanners[currentActiveIndex + 1].objKey;
}

export function getAdditionalBannerData({
  languageCode,
  defaultLangCode,
  banner,
}) {
  let bannerEmoji = '';
  const bannersName = getBannerName({
    currentBanner: banner.objKey,
    languageCode,
    defaultLangCode,
  });
  const charactersFive = [];
  const weaponsFive = [];
  const charactersFour = [];
  const weaponsFour = [];

  if (banner.type === CHARACTERS_BANNER_TYPE_NAME) {
    bannerEmoji = '🧝‍♂️';
  } else if (banner.type === WEAPONS_BANNER_TYPE_NAME) {
    bannerEmoji = '🗡';
  } else if (banner.type === STANDARD_BANNER_TYPE_NAME) {
    bannerEmoji = '🧝‍♂️🗡';
  }

  _.result(banner, 'characters.5', []).forEach((itemObjKey) => {
    charactersFive.push(itemsHelper.getItemData({
      languageCode,
      defaultLangCode,
      objKey: itemObjKey,
      type: TYPE_CHARACTERS_NAME,
    }));
  });

  _.result(banner, 'weapons.5', []).forEach((itemObjKey) => {
    weaponsFive.push(itemsHelper.getItemData({
      languageCode,
      defaultLangCode,
      objKey: itemObjKey,
      type: TYPE_WEAPONS_NAME,
    }));
  });

  _.result(banner, 'characters.4', []).forEach((itemObjKey) => {
    charactersFive.push(itemsHelper.getItemData({
      languageCode,
      defaultLangCode,
      objKey: itemObjKey,
      type: TYPE_CHARACTERS_NAME,
    }));
  });

  _.result(banner, 'weapons.4', []).forEach((itemObjKey) => {
    weaponsFive.push(itemsHelper.getItemData({
      languageCode,
      defaultLangCode,
      objKey: itemObjKey,
      type: TYPE_WEAPONS_NAME,
    }));
  });

  return {
    bannersName,
    bannerEmoji,
    items: [
      ...charactersFive,
      ...weaponsFive,
      ...charactersFour,
      ...weaponsFour,
    ],
  };
}
