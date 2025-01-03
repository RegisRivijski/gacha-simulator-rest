import _ from 'lodash';

import {
  TELEGRAM_STARS_CURRENCY,
  TELEGRAM_PAYMENTS_PROVIDER,
  TELEGRAM_PAYMENTS_PROVIDER_TOKEN,
  TELEGRAM_PAYMENTS_PPOPER_TOKEN,
} from '../constants/index.js';
import {
  PREMIUM_TYPE_MONTH,
  PREMIUM_TYPE_MONTH_COST,

  PREMIUM_TYPE_FOREVER,
  PREMIUM_TYPE_FOREVER_COST,
} from '../constants/economy.js';

import * as actionsData from '../constants/actionsData.js';

import * as linksHelper from './linksHelper.js';

export function getValidPremiumTypeData({
  $t,
  premiumType,
}) {
  if (premiumType === PREMIUM_TYPE_FOREVER) {
    return {
      title: $t('premium.invoice.foreverName'),
      duration: _.lowerFirst($t('premium.cost.forever')),
      type: PREMIUM_TYPE_FOREVER,
      starsCost: PREMIUM_TYPE_FOREVER_COST,
    };
  }
  return {
    title: $t('premium.invoice.onMonthName'),
    duration: $t('premium.cost.month'),
    type: PREMIUM_TYPE_MONTH,
    starsCost: PREMIUM_TYPE_MONTH_COST,
  };
}

export function getInvoice({
  messageTemplate,
  premiumData,
}) {
  return {
    title: premiumData.title,
    photo_url: linksHelper.getLinkForShopItem(),
    description: messageTemplate,
    currency: TELEGRAM_STARS_CURRENCY,
    payload: `${actionsData.PREMIUM_TYPE}:${premiumData.type}`,
    provider: TELEGRAM_PAYMENTS_PROVIDER,
    provider_token: TELEGRAM_PAYMENTS_PROVIDER_TOKEN,
    proper_token: TELEGRAM_PAYMENTS_PPOPER_TOKEN,
    prices: [
      { label: premiumData.title, amount: premiumData.starsCost },
    ],
  };
}
