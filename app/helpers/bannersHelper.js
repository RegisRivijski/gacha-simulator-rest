import _ from 'lodash';

import {
  EVENT_BANNER_CATEGORY_NAME,
  UNIVERSAL_BANNER_CATEGORY_NAME,
} from '../constants/index.js';

import * as staticDataHelper from './staticDataHelper.js';

const banners = staticDataHelper.getBanners();
const bannersPrices = staticDataHelper.getFatesPrices();
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

export function getBannerName(userData) {
  const { languageCode, currentBanner } = userData;
  const currentBannerData = this.getBannerData(currentBanner);
  const bannerNames = _.result(currentBannerData, 'translates', {});
  switch (languageCode) {
    case 'en':
    case 'uk':
      return _.result(bannerNames, 'en', '');
    case 'id':
      return _.result(bannerNames, 'id', '');
    case 'ko':
      return _.result(bannerNames, 'ko', '');
    case 'be':
    case 'ru':
      return _.result(bannerNames, 'ru', '');
    case 'zh-hans':
      return _.result(bannerNames, 'zh-hans', '');
    default:
      if (Object.keys(bannerNames).includes(languageCode)) {
        return _.result(bannerNames, languageCode, '');
      }
      return _.result(bannerNames, 'en', '');
  }
}

export function calculateDropChances({ type = '', fourStar = 0, fiveStar = 0 }) {
  const bannerChances = staticDataHelper.getChancesBanner(type);

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
