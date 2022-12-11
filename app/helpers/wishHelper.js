const {
  BLOCKED_CHARACTERS_OBJ_KEYS,
  BLOCKED_WEAPONS_OBJ_KEYS,
  USERS_HISTORY_ACTION_WISH,
} = require('../constants/index');

const HistoryModel = require('../models/histories');

const itemsHelper = require('./itemsHelper');
const inventoryHelper = require('./inventoryHelper');
const randomizeHelper = require('./randomizeHelper');
const bannerRandomizer = require('./bannerRandomizer');

module.exports = {
  generateNewWishItem(userData) {
    const newItemsData = bannerRandomizer.getNewItems(userData);

    const possibleNewItems = newItemsData.possibleNewItems.filter((itemObjKey) => ![
      ...BLOCKED_CHARACTERS_OBJ_KEYS,
      ...BLOCKED_WEAPONS_OBJ_KEYS,
    ].includes(itemObjKey));

    const newItemObjKey = randomizeHelper.getRandomArrayElement(possibleNewItems);

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
    currentBanner,
    price,
  }) {
    const { chatId } = userData;
    const newItem = this.generateNewWishItem(userData);

    const newItemInDatabase = await inventoryHelper.addingNewItem({
      chatId,
      ...newItem,
    });

    const cashBackForDuplicate = itemsHelper.getCashBackForDuplicate(newItemInDatabase);

    new HistoryModel({
      chatId,
      action: USERS_HISTORY_ACTION_WISH,
      banner: currentBanner,
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
    currentBanner,
    prices,
  }) {
    const wishesData = [];

    for await (const price of prices) {
      const wishData = await this.makeWish({
        userData,
        currentBanner,
        price,
      });
      wishesData.push(wishData);
    }

    return wishesData;
  },
};
