const _ = require('lodash');

const {
  BLOCKED_CHARACTERS_OBJ_KEYS,
  BLOCKED_WEAPONS_OBJ_KEYS,
  USERS_HISTORY_ACTION_WISH,
  TYPE_WEAPONS_NAME,
  EVENT_BANNER_CATEGORY_NAME,
} = require('../constants/index');

const HistoryModel = require('../models/histories');

const itemsHelper = require('./itemsHelper');
const inventoryHelper = require('./inventoryHelper');
const randomizeHelper = require('./randomizeHelper');
const bannerRandomizer = require('./bannerRandomizer');
const guaranteeSystemCounter = require('./guaranteeSystemCounter');

module.exports = {
  generateNewWishItem(userData) {
    const newItemsData = bannerRandomizer.getNewItems(userData);
    const newItemObjKey = randomizeHelper.getRandomArrayElement(
      newItemsData
        .possibleNewItems
        .filter((itemObjKey) => ![...BLOCKED_CHARACTERS_OBJ_KEYS, ...BLOCKED_WEAPONS_OBJ_KEYS].includes(itemObjKey)),
    );
    const newItemData = itemsHelper.getItemData({
      langCode: userData.languageCode,
      objKey: newItemObjKey,
      type: newItemsData.newItemType,
    });
    return {
      newItemObjKey,
      newItemData,
      ...newItemsData,
    };
  },

  async makeWish({
    userData,
    currentBannerData,
    price,
  }) {
    const chatId = _.result(userData, 'chatId');
    const currentBannerType = _.result(currentBannerData, 'type');
    const currentBannerCategory = _.result(currentBannerData, 'category');

    const newItem = this.generateNewWishItem(userData);
    const newItemInDatabase = await inventoryHelper.addingNewItem({ chatId, ...newItem });

    const cashBackForDuplicate = newItemInDatabase.count > 1 || currentBannerType === TYPE_WEAPONS_NAME
      ? itemsHelper.getCashBackForDuplicate(newItemInDatabase)
      : { cashBackTemplate: '', currency: '', price: 0 };

    const guaranteeStarChances = guaranteeSystemCounter.getNewValuesForGuaranteeSystem({
      userData,
      currentBannerType,
      newItemRarity: newItem.newItemRarity,
    });
    _.set(userData, [currentBannerType, 'fourStar'], guaranteeStarChances.fourStar);
    _.set(userData, [currentBannerType, 'fiveStar'], guaranteeStarChances.fiveStar);

    if (currentBannerCategory === EVENT_BANNER_CATEGORY_NAME) {
      switch (Number(newItem.newItemRarity)) {
        case 4:
          if (newItem.newItemIsEvent) {
            _.set(userData, [currentBannerType, 'fourStarEventGuaranteed'], false);
          } else {
            _.set(userData, [currentBannerType, 'fourStarEventGuaranteed'], true);
          }
          break;
        case 5:
          if (newItem.newItemIsEvent) {
            _.set(userData, [currentBannerType, 'fiveStarEventGuaranteed'], false);
          } else {
            _.set(userData, [currentBannerType, 'fiveStarEventGuaranteed'], true);
          }
          break;
        default:
      }
    }

    new HistoryModel({
      chatId,
      action: USERS_HISTORY_ACTION_WISH,
      banner: currentBannerData.objKey,
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
  },

  async makeWishFewTimes({
    userData,
    currentBannerData,
    prices,
  }) {
    const wishesData = [];

    for await (const price of prices) {
      const wishData = await this.makeWish({
        userData,
        currentBannerData,
        price,
      });
      wishesData.push(wishData);
    }

    return wishesData;
  },
};
