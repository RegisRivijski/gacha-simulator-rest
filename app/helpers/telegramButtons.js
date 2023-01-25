import {
  WISH_ACTION_KEY,
  WISH_10_ACTION_KEY,
  PROFILE_ACTION_KEY,
  PROFILE_PRIMOGEMS_GET_ACTION_KEY,
  PROFILE_CHANGE_BANNER_ACTION_KEY,
  INVENTORY_ACTION_KEY,
  HISTORY_ACTION_KEY,
} from '../constants/actions.js';

export function getForWish({
  $t,
  canBuyOneMoreTime,
  chatId,
}) {
  if (canBuyOneMoreTime) {
    return [
      {
        message: $t('wish.makeWishAgain'),
        data: `${WISH_ACTION_KEY} u${chatId}u`,
      },
    ];
  }
  return [
    {
      message: $t('users.profile.name'),
      data: `${PROFILE_ACTION_KEY} u${chatId}u`,
    },
  ];
}

export function getForWishX10({
  $t,
  canBuyOneMoreTime,
  chatId,
}) {
  if (canBuyOneMoreTime) {
    return [
      {
        message: $t('wish10.makeWishAgain'),
        data: `${WISH_10_ACTION_KEY} u${chatId}u`,
      },
    ];
  }
  return [
    {
      message: $t('users.profile.name'),
      data: `${PROFILE_ACTION_KEY} u${chatId}u`,
    },
  ];
}

export function getProfileButtons({
  $t,
  chatId,
  primogemsAdded,
  getPrimogems,
}) {
  const markupButtons = [];
  if (primogemsAdded > 60 && !getPrimogems) {
    markupButtons.push([
      {
        message: `${$t('users.profile.primogemsEarned')} +${primogemsAdded} ✦`,
        data: `${PROFILE_PRIMOGEMS_GET_ACTION_KEY} u${chatId}u`,
      },
    ]);
  }
  markupButtons.push(
    [
      {
        message: `${$t('banners.change')} 💫`,
        data: `${PROFILE_CHANGE_BANNER_ACTION_KEY} u${chatId}u`,
      },
    ],
    [
      {
        message: $t('users.inventory.name'),
        data: `${INVENTORY_ACTION_KEY} u${chatId}u`,
      },
      {
        message: $t('users.history.name'),
        data: `${HISTORY_ACTION_KEY} u${chatId}u`,
      },
    ],
  );
  return markupButtons;
}

export function getInventoryButtons({
  $t,
  chatId,
}) {
  return [
    {
      message: $t('users.profile.name'),
      data: `${PROFILE_ACTION_KEY} u${chatId}u`,
    },
    {
      message: $t('users.history.name'),
      data: `${HISTORY_ACTION_KEY} u${chatId}u`,
    },
  ];
}

export function getHistoryButtons({
  $t,
  chatId,
}) {
  return [
    {
      message: $t('users.profile.name'),
      data: `${PROFILE_ACTION_KEY} u${chatId}u`,
    },
    {
      message: $t('users.inventory.name'),
      data: `${INVENTORY_ACTION_KEY} u${chatId}u`,
    },
  ];
}
