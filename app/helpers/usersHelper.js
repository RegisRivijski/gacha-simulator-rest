const _ = require('lodash');

const {
  DEFAULT_BANNER_FOR_USERS,
} = require('../constants/index');

const bannersHelper = require('./bannersHelper');

const bannersKeys = bannersHelper.getActiveBanners()
  .map(({ objKey }) => objKey);

module.exports = {
  validateCurrentBanner({ currentBanner }) {
    if (bannersKeys.includes(currentBanner)) {
      return {
        currentBannerIsValid: true,
        currentBanner,
      };
    }
    return {
      currentBannerIsValid: false,
      currentBanner: DEFAULT_BANNER_FOR_USERS,
    };
  },

  getEventGuarantee(userData, bannerType, rarity) {
    switch (rarity) {
      case 4:
        return _.result(userData, [bannerType, 'four'], false);
      case 5:
        return _.result(userData, [bannerType, 'five'], false);
      default:
        return false;
    }
  },
};
