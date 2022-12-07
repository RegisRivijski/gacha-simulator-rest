const {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
} = require('../constants/index');

const itemsHelper = require('./itemsHelper');
const ItemsModel = require('../models/items');

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

  addingNewItem({ chatId, newItemObjKey, newItemType }) {
    return ItemsModel.findOne({
      chatId,
      objKey: newItemObjKey,
      type: newItemType,
    })
      .then((currentInventoryItem) => {
        if (currentInventoryItem) {
          // eslint-disable-next-line no-param-reassign
          currentInventoryItem.count += 1;
          return currentInventoryItem.save();
        }
        return new ItemsModel({
          chatId,
          type: newItemType,
          objKey: newItemObjKey,
          count: 1,
        }).save();
      });
  },

  addingManyNewItems({ chatId, newItems }) {
    return Promise.all(
      newItems.map((newItem) => this.addingNewItem({ chatId, ...newItem })),
    );
  },
};
