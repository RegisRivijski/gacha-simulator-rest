import _ from 'lodash';

import {
  BLOCKED_CHARACTERS_OBJ_KEYS,
  BLOCKED_WEAPONS_OBJ_KEYS,
  USERS_HISTORY_ACTION_WISH,
  TYPE_WEAPONS_NAME,
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
} from '../constants/index.js';

import HistoryModel from '../models/histories.js';

import * as itemsHelper from './itemsHelper.js';
import * as inventoryHelper from './inventoryHelper.js';
import * as randomizeHelper from './randomizeHelper.js';
import * as bannerRandomizer from './bannerRandomizer.js';
import * as guaranteeSystemCounter from './guaranteeSystemCounter.js';

export function generateNewWishItem(userData, defaultLangCode) {
  const newItemsData = bannerRandomizer.getNewItems(userData);
  const newItemObjKey = randomizeHelper.getRandomArrayElement(
    newItemsData
      .possibleNewItems
      .filter((itemObjKey) => ![...BLOCKED_CHARACTERS_OBJ_KEYS, ...BLOCKED_WEAPONS_OBJ_KEYS].includes(itemObjKey)),
  );
  const newItemData = itemsHelper.getItemData({
    languageCode: userData.languageCode,
    defaultLangCode,
    objKey: newItemObjKey,
    type: newItemsData.newItemType,
  });
  return {
    newItemObjKey,
    newItemData,
    ...newItemsData,
  };
}

export async function makeWish({
  userData,
  currentBannerData,
  price,
  defaultLangCode,
}) {
  const chatId = _.result(userData, 'chatId');
  const currentBannerType = _.result(currentBannerData, 'type');

  const newItem = generateNewWishItem(userData, defaultLangCode);
  const newItemInDatabase = await inventoryHelper.addingNewItem({ chatId, ...newItem });

  const cashBackForDuplicate = newItemInDatabase.count > 1 || currentBannerType === TYPE_WEAPONS_NAME
    ? itemsHelper.getCashBackForDuplicate(newItem.newItemData)
    : { cashBackTemplate: '', currency: '', price: 0 };

  const guaranteeStarChances = guaranteeSystemCounter.getNewValuesForGuaranteeSystem({
    userData,
    currentBannerData,
    newItem,
  });

  _.set(userData, [currentBannerType, 'fourStar'], guaranteeStarChances.fourStar);
  _.set(userData, [currentBannerType, 'fiveStar'], guaranteeStarChances.fiveStar);

  _.set(userData, [currentBannerType, 'fourStarEventGuaranteed'], guaranteeStarChances.fourStarEventGuaranteed);
  _.set(userData, [currentBannerType, 'fiveStarEventGuaranteed'], guaranteeStarChances.fiveStarEventGuaranteed);

  new HistoryModel({
    chatId,
    action: USERS_HISTORY_ACTION_WISH,
    banner: currentBannerType,
    type: newItem.newItemType,
    objKey: newItem.newItemObjKey,
    currency: price.key,
    currencyCount: price.value,
  }).save()
    .catch((e) => {
      console.error('[ERROR] wishHelper makeWish new HistoryModel save', e.message);
    });
  return {
    newItem,
    cashBackForDuplicate,
    price,
  };
}

export async function makeWishFewTimes({
  userData,
  currentBannerData,
  prices,
  defaultLangCode,
}) {
  const wishesData = [];

  for await (const price of prices) {
    const wishData = await makeWish({
      userData,
      currentBannerData,
      price,
      defaultLangCode,
    });
    wishesData.push(wishData);
  }

  return wishesData;
}

export function orderWishes({
  wishesData,
  currentBannerType,
}) {
  switch (currentBannerType) {
    case WEAPONS_BANNER_TYPE_NAME:
      return _.orderBy(
        wishesData,
        ['newItem.newItemRarity', 'newItem.newItemType', 'newItem.newItemData.name'],
        ['desc', 'asc', 'asc'],
      );
    case STANDARD_BANNER_TYPE_NAME:
    case CHARACTERS_BANNER_TYPE_NAME:
    default:
      return _.orderBy(
        wishesData,
        ['newItem.newItemRarity', 'newItem.newItemType', 'newItem.newItemData.name'],
        ['desc', 'desc', 'asc'],
      );
  }
}
