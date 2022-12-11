const {
  BLOCKED_CHARACTERS_OBJ_KEYS,
  BLOCKED_WEAPONS_OBJ_KEYS,
} = require('../constants/index');

const itemsHelper = require('./itemsHelper');
const randomizeHelper = require('./randomizeHelper');
const bannerRandomizer = require('./bannerRandomizer');

module.exports = {
  makeWish(userData) {
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

  makeWishFewTimes(userData, wishesCount) {
    const wishes = [];
    for (let i = 0; i < wishesCount; i += 1) {
      wishes.push(this.makeWish(userData));
    }
    return wishes;
  },
};
