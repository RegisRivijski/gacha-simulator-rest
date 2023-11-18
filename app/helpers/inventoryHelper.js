import {
  TYPE_CHARACTERS_NAME,
  TYPE_WEAPONS_NAME,
} from '../constants/index.js';

import * as itemsHelper from './itemsHelper.js';
import ItemsModel from '../models/genshinImpactTgBot/items.js';

export function makingInventoryTree(items, languageCode, defaultLangCode) {
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
      languageCode,
      defaultLangCode,
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
}

export function addingNewItem({ chatId, newItemObjKey, newItemType }) {
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
}
