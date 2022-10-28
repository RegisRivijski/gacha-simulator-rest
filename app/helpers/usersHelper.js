const {
  DEFAULT_BANNER_FOR_USERS,
} = require('../constants/index');

const bannersHelper = require('./bannersHelper');

const bannersKeys = bannersHelper.getActiveBanners()
  .map(({ objKey }) => objKey);

module.exports = {
  validateCurrentBanner({ currentBanner }) {
    if (currentBanner in bannersKeys) {
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
};
