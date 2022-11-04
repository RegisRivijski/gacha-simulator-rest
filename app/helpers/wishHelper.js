const {
  BLOCKED_CHARACTERS_OBJ_KEYS,
  BLOCKED_WEAPONS_OBJ_KEYS,
} = require('../constants/index');

const randomizeHelper = require('./randomizeHelper');
const bannerRandomizer = require('./bannerRandomizer');

module.exports = {
  makeWish(userData) {
    const newItemsData = bannerRandomizer.getNewItems(userData);

    const newItems = newItemsData.newItems.filter((itemObjKey) => ![
      ...BLOCKED_CHARACTERS_OBJ_KEYS,
      ...BLOCKED_WEAPONS_OBJ_KEYS,
    ].includes(itemObjKey));

    const resultItem = randomizeHelper.getRandomArrayElement(newItems);

    return {
      resultItem,
      ...newItemsData,
    };
  },
};
