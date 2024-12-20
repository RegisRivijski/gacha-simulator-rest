import _ from 'lodash';

import {
  DEFAULT_BANNER_FOR_USERS,
} from '../constants/index.js';
import {
  PRIMOGEMS_GET_MAX,
  PRIMOGEMS_COEFFICIENT,
} from '../constants/economy.js';

import UsersModel from '../models/genshinImpactTgBot/users.js';
import UsersByBots from '../models/genshinImpactTgBot/usersByBots.js';

import * as bannersHelper from './bannersHelper.js';
import * as timeHelper from './timeHelper.js';
import * as financialOperationsHelper from './financialOperationsHelper.js';

const bannersKeys = bannersHelper.getActiveBanners()
  .map(({ objKey }) => objKey);

export function getUserData(chatId) {
  return UsersModel.findOne({ chatId })
    .then((userData) => {
      if (userData) {
        return {
          userData,
          created: false,
        };
      }
      return {
        userData: new UsersModel({
          chatId,
        }),
        created: true,
      };
    });
}

export function getUserByBot(chatId, defaultLangCode) {
  return UsersByBots.findOne({ chatId, defaultLangCode })
    .then((userData) => {
      if (userData) {
        return userData;
      }
      return new UsersByBots({
        chatId,
        defaultLangCode,
        isActive: true,
      })
        .save();
    });
}

export function validateCurrentBanner({ currentBanner }) {
  const isValid = bannersKeys.includes(currentBanner);
  return {
    currentBannerIsValid: isValid,
    currentBanner: isValid
      ? currentBanner
      : DEFAULT_BANNER_FOR_USERS,
  };
}

export function getEventGuarantee(userData, bannerType, rarity) {
  switch (rarity) {
    case 4:
      return _.result(userData, [bannerType, 'fourStarEventGuaranteed'], false);
    case 5:
      return _.result(userData, [bannerType, 'fiveStarEventGuaranteed'], false);
    default:
      return false;
  }
}

export function getPrimogems({ primogemsAdded }) {
  const primogems = Math.floor(timeHelper.howManyMinutesPast(primogemsAdded) * PRIMOGEMS_COEFFICIENT);
  return primogems > PRIMOGEMS_GET_MAX ? PRIMOGEMS_GET_MAX : primogems;
}

export function getAdditionalData(userData) {
  const { currentBanner } = validateCurrentBanner(userData);

  const currentBannerData = bannersHelper.getBannerData(currentBanner);
  const currentBannerType = _.result(currentBannerData, 'type');
  const currentBannerPrices = bannersHelper.getBannerPrices(currentBannerType);
  const wallet = _.result(userData, '_doc', {});

  const primogemsGet = getPrimogems(userData);
  const primogemsGetMaxLimit = primogemsGet === PRIMOGEMS_GET_MAX;
  const prices = financialOperationsHelper.determinePriceFewTimes(wallet, currentBannerPrices, 9999);
  const hoursFromLastWish = timeHelper.howManyHoursPast(userData.updated);
  const hoursFromLastPrimogemsAdded = timeHelper.howManyHoursPast(userData.primogemsAdded);

  return {
    primogemsGet,
    primogemsGetMaxLimit,
    canBuyWishes: prices.length,
    hoursFromLastWish,
    hoursFromLastPrimogemsAdded,
  };
}

export function getLeaderboard(defaultLangCode = 'ru') {
  return UsersByBots.aggregate([
    {
      $match: {
        isActive: true,
        defaultLangCode,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'chatId',
        foreignField: 'chatId',
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $project: {
        chatId: '$userData.chatId',
        firstName: '$userData.firstName',
        lastName: '$userData.lastName',
        primogems: '$userData.primogems',
      },
    },
    {
      $sort: {
        primogems: -1,
      },
    },
  ]);
}
