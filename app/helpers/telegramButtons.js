export function getForWish({
  $t,
  canBuyOneMoreTime,
  chatId,
}) {
  if (canBuyOneMoreTime) {
    return [
      {
        message: $t('wish.makeWishAgain'),
        data: `wi u${chatId}u`,
      },
    ];
  }
  return [
    {
      message: $t('users.profile.name'),
      data: `pr u${chatId}u`,
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
        data: `wi10 u${chatId}u`,
      },
    ];
  }
  return [
    {
      message: $t('users.profile.name'),
      data: `pr u${chatId}u`,
    },
  ];
}

export function getProfileButtons({
  $t,
  chatId,
  primogemsAdded,
  getPrimogems,
}) {
  const markupButtons = [[
    {
      message: `${$t('banners.change')} 💫`,
      data: `pr_chng u${chatId}u`,
    },
  ]];
  if (primogemsAdded && !getPrimogems) {
    markupButtons.push([
      {
        message: `${$t('users.profile.primogemsEarned')} +${primogemsAdded} ✦`,
        data: `pr_get u${chatId}u`,
      },
    ]);
  }
  markupButtons.push([
    {
      message: $t('users.inventory.name'),
      data: `in u${chatId}u`,
    },
    {
      message: $t('users.history.name'),
      data: `hi u${chatId}u`,
    },
  ]);
  return markupButtons;
}

export function getInventoryButtons({
  $t,
  chatId,
}) {
  return [
    {
      message: $t('users.profile.name'),
      data: `pr u${chatId}u`,
    },
    {
      message: $t('users.history.name'),
      data: `hi u${chatId}u`,
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
      data: `pr u${chatId}u`,
    },
    {
      message: $t('users.inventory.name'),
      data: `in u${chatId}u`,
    },
  ];
}
