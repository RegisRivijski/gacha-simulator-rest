const _ = require('lodash');

const {
  EVENT_BANNER_CATEGORY_NAME,
} = require('../constants');

const staticDataHelper = require('./staticDataHelper');
const documentsHelper = require('./documentsHelper');

module.exports = {

  getNewValuesForGuaranteeSystem({
    userData,
    currentBannerData,
    newItem,
  }) {
    const currentBannerType = _.result(currentBannerData, 'type');
    const currentBannerCategory = _.result(currentBannerData, 'category');
    const bannerChances = staticDataHelper.getChancesBanner(currentBannerType);

    let fourStar = _.result(userData, [currentBannerType, 'fourStar'], 1);
    let fiveStar = _.result(userData, [currentBannerType, 'fiveStar'], 1);

    let fourStarEventGuaranteed = _.result(userData, [currentBannerType, 'fourStarEventGuaranteed'], false);
    let fiveStarEventGuaranteed = _.result(userData, [currentBannerType, 'fiveStarEventGuaranteed'], false);

    switch (Number(newItem.newItemRarity)) {
      case 3:
        fourStar = documentsHelper.incrementNumberWithLimit(fourStar, bannerChances.fourStar.guarantee);
        fiveStar = documentsHelper.incrementNumberWithLimit(fiveStar, bannerChances.fiveStar.guarantee);
        break;
      case 4:
        fourStar = 1;
        fiveStar = documentsHelper.incrementNumberWithLimit(fiveStar, bannerChances.fiveStar.guarantee);
        break;
      case 5:
        fourStar = documentsHelper.incrementNumberWithLimit(fourStar, bannerChances.fourStar.guarantee);
        fiveStar = 1;
        break;
      default:
        break;
    }

    if (currentBannerCategory === EVENT_BANNER_CATEGORY_NAME) {
      switch (Number(newItem.newItemRarity)) {
        case 4:
          fourStarEventGuaranteed = !newItem.newItemIsEvent;
          break;
        case 5:
          fiveStarEventGuaranteed = !newItem.newItemIsEvent;
          break;
        default:
      }
    }

    return {
      fiveStar,
      fourStar,
      fiveStarEventGuaranteed,
      fourStarEventGuaranteed,
    };
  },
};
