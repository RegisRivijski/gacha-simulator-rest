import {
  TELEGRAM_STARS_CURRENCY,
  TELEGRAM_PAYMENTS_PROVIDER,
  TELEGRAM_PAYMENTS_PROVIDER_TOKEN,
  TELEGRAM_PAYMENTS_PPOPER_TOKEN,
} from '../constants/index.js';
import {
  SHOP_ITEM_ID,
} from '../constants/actionsData.js';

import ShopModel from '../models/genshinImpactTgBot/shop.js';

import * as linksHelper from './linksHelper.js';

export async function getAvailableShopItems() {
  return ShopModel.find({})
    .sort({ order: 1 })
    .lean();
}

export function getInvoice({
  $t,
  shopItemData,
  messageTemplate,
}) {
  const title = [
    $t(`users.profile.${shopItemData.currencyType}`),
    '-',
    shopItemData.count,
    $t(`shop.currency.${shopItemData.currencyType}`),
  ].join(' ');

  return {
    title,
    photo_url: linksHelper.getLinkForShopItem(),
    description: messageTemplate,
    currency: TELEGRAM_STARS_CURRENCY,
    payload: `${SHOP_ITEM_ID}:${shopItemData?.shopItemId}`,
    provider: TELEGRAM_PAYMENTS_PROVIDER,
    provider_token: TELEGRAM_PAYMENTS_PROVIDER_TOKEN,
    proper_token: TELEGRAM_PAYMENTS_PPOPER_TOKEN,
    prices: [
      { label: title, amount: shopItemData.starsCost },
    ],
  };
}
