const {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
} = require('../constants/index');

const itemsHelper = require('./itemsHelper');

module.exports = {
  makingInventoryTree(items, langCode) {
    const charactersInv = {
      five: [],
      four: [],
    };
    const weaponsInv = {
      five: [],
      four: [],
    };

    for (const item of items) {
      // eslint-disable-next-line no-underscore-dangle
      let rarity;

      const itemData = itemsHelper.getItemData({
        langCode,
        objKey: item.objKey,
        type: item.type,
      });

      if (Number(itemData.rarity) === 5) {
        rarity = 'five';
      } else if (Number(itemData.rarity) === 4) {
        rarity = 'four';
      }

      if (rarity) {
        const itemName = `<a href="${itemData?.url?.fandom.replaceAll('"', '')}">${itemData.name} (x${item.count})</a>`;
        switch (item.type) {
          case TYPE_CHARACTERS_NAME:
            charactersInv[rarity].push(itemName);
            break;
          case TYPE_WEAPONS_NAME:
            weaponsInv[rarity].push(itemName);
            break;
          default:
        }
      }
    }

    return {
      charactersInv,
      weaponsInv,
    };
  },
};
