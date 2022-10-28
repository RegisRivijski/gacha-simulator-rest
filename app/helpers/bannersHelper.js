const _ = require('lodash');

const {
  EVENT_BANNER_CATEGORY_NAME,
  UNIVERSAL_BANNER_CATEGORY_NAME,
} = require('../constants/index');

const staticDataHelper = require('./staticDataHelper');

const banners = staticDataHelper.getBanners();
const bannersArray = Object.values(banners);

module.exports = {
  getActiveBanners() {
    return bannersArray.filter((banner) => {
      const { isActive } = banner;
      return isActive;
    });
  },

  getActiveEventBanners() {
    return bannersArray.filter((banner) => {
      const { isActive, category } = banner;
      return isActive && category === EVENT_BANNER_CATEGORY_NAME;
    });
  },

  getActiveUniversalBanners() {
    return bannersArray.filter((banner) => {
      const { isActive, category } = banner;
      return isActive && category === UNIVERSAL_BANNER_CATEGORY_NAME;
    });
  },

  getBannerData(objKey) {
    return _.result(banners, objKey, {});
  },

  calculateDropChances({ type = '', fourStar = 0, fiveStar = 0 }) {
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
  },
};
