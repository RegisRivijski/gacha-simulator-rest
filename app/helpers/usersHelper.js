import _ from 'lodash';

import {
  DEFAULT_BANNER_FOR_USERS,
  PRIMOGEMS_GET_MAX,
} from '../constants/index.js';

import * as bannersHelper from './bannersHelper.js';
import * as timeHelper from './timeHelper.js';

const bannersKeys = bannersHelper.getActiveBanners()
  .map(({ objKey }) => objKey);

export function validateCurrentBanner({ currentBanner }) {
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
}

export function getEventGuarantee(userData, bannerType, rarity) {
  switch (rarity) {
    case 4:
      return _.result(userData, [bannerType, 'four'], false);
    case 5:
      return _.result(userData, [bannerType, 'five'], false);
    default:
      return false;
  }
}

export function getPrimogems({ primogemsAdded }) {
  const primogems = timeHelper.howManySecondsPast(primogemsAdded);
  return primogems > PRIMOGEMS_GET_MAX ? PRIMOGEMS_GET_MAX : primogems;
}
