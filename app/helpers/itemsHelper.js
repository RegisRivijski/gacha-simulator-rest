const _ = require('lodash');

const staticDataHelper = require('./staticDataHelper');

module.exports = {
  getItemData({ langCode, objKey, type }) {
    const itemData = staticDataHelper.getItems({
      langCode,
      type,
    });
    return _.result(itemData, objKey, {});
  },

  getItemsByTypeAndRarity({ type, rarity }) {
    const itemsData = Object.values(staticDataHelper.getItems({ type }));
    return itemsData.filter((itemData) => Number(itemData.rarity) === rarity);
  },
};
