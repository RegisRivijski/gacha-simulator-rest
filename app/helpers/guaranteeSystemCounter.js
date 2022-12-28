import _ from 'lodash';

import {
  EVENT_BANNER_CATEGORY_NAME,
} from '../constants/index.js';

import * as staticDataHelper from './staticDataHelper.js';
import * as documentsHelper from './documentsHelper.js';

export function getNewValuesForGuaranteeSystem({
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

  fourStar = Number(newItem.newItemRarity) === 4
    ? 1
    : documentsHelper.incrementNumberWithLimit(fourStar, bannerChances.fourStar.guarantee);

  fiveStar = Number(newItem.newItemRarity) === 5
    ? 1
    : documentsHelper.incrementNumberWithLimit(fiveStar, bannerChances.fiveStar.guarantee);

  if (currentBannerCategory === EVENT_BANNER_CATEGORY_NAME) {
    if (Number(newItem.newItemRarity) === 4) {
      fourStarEventGuaranteed = !newItem.newItemIsEvent;
    } else if (Number(newItem.newItemRarity) === 5) {
      fiveStarEventGuaranteed = !newItem.newItemIsEvent;
    }
  }

  return {
    fiveStar,
    fourStar,
    fiveStarEventGuaranteed,
    fourStarEventGuaranteed,
  };
}
