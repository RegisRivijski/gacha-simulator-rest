const _ = require('lodash');

const {
  STARDUST_NAME,
  STARGLITTER_NAME,
} = require('../constants/index');

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

  getCashBackForDuplicate(itemInDatabase) {
    let cashBackTemplate = '';
    let price = 0;
    let currency = '';
    if (Number(itemInDatabase.count) > 1) {
      switch (Number(itemInDatabase.rarity)) {
        case 3:
          cashBackTemplate = '15 ✨';
          price = 15;
          currency = STARDUST_NAME;
          break;
        case 4:
          cashBackTemplate = '2 🌟';
          price = 2;
          currency = STARGLITTER_NAME;
          break;
        case 5:
          cashBackTemplate = '10 🌟';
          price = 10;
          currency = STARGLITTER_NAME;
          break;
        default:
      }
    }
    return {
      cashBackTemplate,
      price,
      currency,
    };
  },
};
