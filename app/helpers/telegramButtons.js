import {
  WISH_ACTION_KEY,
  WISH_10_ACTION_KEY,
  PROFILE_ACTION_KEY,
  PROFILE_PRIMOGEMS_GET_ACTION_KEY,
  PROFILE_CHANGE_BANNER_ACTION_KEY,
  PROFILE_WITHOUT_UPDATE_ACTION_KEY,
  INVENTORY_ACTION_KEY,
  HISTORY_ACTION_KEY,
  LEADERBOARD_ACTION_KEY,
  SETTINGS_ACTION_KEY,
} from '../constants/actions.js';

export function getForWish({
  $t,
  canBuyOneMoreTime,
  chatId,
}) {
  if (canBuyOneMoreTime) {
    return [
      {
        message: `${$t('wish.makeWishAgain')} 💫`,
        data: `${WISH_ACTION_KEY} ow:${chatId}`,
      },
    ];
  }
  return [
    {
      message: `${$t('users.profile.name')} ✨`,
      data: `${PROFILE_WITHOUT_UPDATE_ACTION_KEY} ow:${chatId}`,
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
        message: `${$t('wish.makeWishAgain')} 💫`,
        data: `${WISH_10_ACTION_KEY} ow:${chatId}`,
      },
    ];
  }
  return [
    {
      message: `${$t('users.profile.name')} ✨`,
      data: `${PROFILE_WITHOUT_UPDATE_ACTION_KEY} ow:${chatId}`,
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
        data: `${PROFILE_PRIMOGEMS_GET_ACTION_KEY} ow:${chatId}`,
      },
    ]);
  }
  markupButtons.push(
    [
      {
        message: `${$t('banners.change')} 💫`,
        data: `${PROFILE_CHANGE_BANNER_ACTION_KEY} ow:${chatId}`,
      },
    ],
    [
      {
        message: `${$t('users.inventory.name')} 🎒`,
        data: `${INVENTORY_ACTION_KEY} ow:${chatId}`,
      },
      {
        message: `${$t('users.history.name')} 📖`,
        data: `${HISTORY_ACTION_KEY} ow:${chatId}`,
      },
    ],
    [
      {
        message: `🏆 ${$t('users.leaderboard.globalTitle')} ✦ 🏆`,
        data: `${LEADERBOARD_ACTION_KEY} ow:${chatId}`,
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
      message: `${$t('users.profile.name')} ✨`,
      data: `${PROFILE_ACTION_KEY} ow:${chatId}`,
    },
    {
      message: `${$t('users.history.name')} 📖`,
      data: `${HISTORY_ACTION_KEY} ow:${chatId}`,
    },
  ];
}

export function getHistoryButtons({
  $t,
  chatId,
  page,
  pagesCount,
}) {
  const arrowForward = '▶️';
  const arrowBack = '◀️';

  const pagination = [];
  if (page > 0) {
    pagination.push({
      message: arrowBack,
      data: `${HISTORY_ACTION_KEY} ow:${chatId} pg:${page - 1}`,
    });
  }

  pagination.push({
    message: `${$t('users.history.page')} ${page + 1}`,
    data: `${HISTORY_ACTION_KEY} ow:${chatId} pg:${
      page === 0
        ? pagesCount - 1
        : 0
    }`,
  });

  if (page + 1 < pagesCount) {
    pagination.push({
      message: arrowForward,
      data: `${HISTORY_ACTION_KEY} ow:${chatId} pg:${page + 1}`,
    });
  }
  return [
    pagination,
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${PROFILE_ACTION_KEY} ow:${chatId}`,
      },
      {
        message: `${$t('users.inventory.name')} 🎒`,
        data: `${INVENTORY_ACTION_KEY} ow:${chatId}`,
      },
    ],
  ];
}

export function getSettingsButtons({
  chatId,
  languages,
  languageCode,
}) {
  return [
    ...languages.map((data) => (
      [
        {
          message: languageCode === data.code
            ? `✅ ${data.name}`
            : data.name,
          data: `${SETTINGS_ACTION_KEY} ow:${chatId} cd:${data.code}`,
        },
      ]
    )),
  ];
}

export function getLeaderboardButtons({
  $t,
  chatId,
  page,
  pagesCount,
  pageWithMe,
}) {
  const arrowForward = '▶️';
  const arrowBack = '◀️';

  const pagination = [];
  const buttons = [
    {
      message: `${$t('users.profile.name')} ✨`,
      data: `${PROFILE_ACTION_KEY} ow:${chatId}`,
    },
  ];

  if (page > 0) {
    pagination.push({
      message: arrowBack,
      data: `${LEADERBOARD_ACTION_KEY} ow:${chatId} pg:${page - 1}`,
    });
  }

  pagination.push({
    message: `${$t('users.history.page')} ${page + 1}`,
    data: `${LEADERBOARD_ACTION_KEY} ow:${chatId} pg:${
      page === 0
        ? pagesCount - 1
        : 0
    }`,
  });

  if (page + 1 < pagesCount) {
    pagination.push({
      message: arrowForward,
      data: `${LEADERBOARD_ACTION_KEY} ow:${chatId} pg:${page + 1}`,
    });
  }

  if (page !== pageWithMe && pageWithMe >= 0 && pageWithMe < pagesCount) {
    buttons.push({
      message: `${$t('users.leaderboard.showMe')} 🔍️️️️️️`,
      data: `${LEADERBOARD_ACTION_KEY} ow:${chatId} pg:${pageWithMe}`,
    });
  }

  return [
    pagination,
    buttons,
  ];
}
