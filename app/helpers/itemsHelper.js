import _ from 'lodash';

import {
  STARDUST_NAME,
  STARGLITTER_NAME,
} from '../constants/economy.js';

import * as staticData from '../modules/staticData.js';

export function getItemData({
  languageCode,
  defaultLangCode,
  objKey,
  type,
}) {
  const itemData = staticData.getItems({
    languageCode,
    defaultLangCode,
    type,
  });
  return _.result(itemData, objKey, {});
}

export function getItemsByTypeAndRarity({ type, rarity }) {
  const itemsData = Object.values(staticData.getItems({ type }));
  return itemsData.filter((itemData) => Number(itemData.rarity) === rarity);
}

export function getCashBackForDuplicate({ rarity }) {
  let cashBackTemplate = '';
  let price = 0;
  let currency = '';
  switch (Number(rarity)) {
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
  return {
    cashBackTemplate,
    price,
    currency,
  };
}
