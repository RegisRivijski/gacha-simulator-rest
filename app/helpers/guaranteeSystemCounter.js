const _ = require('lodash');

const staticDataHelper = require('./staticDataHelper');
const documentsHelper = require('./documentsHelper');

module.exports = {

  getNewValuesForGuaranteeSystem({
    userData,
    currentBannerType,
    newItemRarity,
  }) {
    const guaranteeLimits = staticDataHelper.getChancesBanner(currentBannerType);

    let fourStar = _.result(userData, [currentBannerType, 'fourStar'], 1);
    let fiveStar = _.result(userData, [currentBannerType, 'fiveStar'], 1);

    switch (Number(newItemRarity)) {
      case 3:
        fourStar = documentsHelper.incrementNumberWithLimit(fourStar, guaranteeLimits.fourStar);
        fiveStar = documentsHelper.incrementNumberWithLimit(fiveStar, guaranteeLimits.fiveStar);
        break;
      case 4:
        fourStar = 1;
        fiveStar = documentsHelper.incrementNumberWithLimit(fiveStar, guaranteeLimits.fiveStar);
        break;
      case 5:
        fourStar = documentsHelper.incrementNumberWithLimit(fourStar, guaranteeLimits.fourStar);
        fiveStar = 1;
        break;
      default:
        break;
    }

    return {
      fiveStar,
      fourStar,
    };
  },
};
