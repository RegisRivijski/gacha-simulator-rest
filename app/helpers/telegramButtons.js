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

import {
  BUTTON_TYPE_URL,
} from '../constants/index.js';

import {
  CHAT_LINK,
  CHANNEL_LINK_RU,
  CHANNEL_LINK_EU,
} from '../constants/links.js';

export function getForWish({
  $t,
  canBuyOneMoreTime,
  chatId,
  defaultLangCode,
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
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${PROFILE_WITHOUT_UPDATE_ACTION_KEY} ow:${chatId}`,
      },
    ],
    [
      {
        message: $t('phrases.genshinGachaChannel'),
        data: defaultLangCode === 'ru' ? CHANNEL_LINK_RU : CHANNEL_LINK_EU,
        type: BUTTON_TYPE_URL,
      },
    ],
  ];
}

export function getForWishX10({
  $t,
  canBuyOneMoreTime,
  chatId,
  defaultLangCode,
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
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${PROFILE_WITHOUT_UPDATE_ACTION_KEY} ow:${chatId}`,
      },
    ],
    [
      {
        message: $t('phrases.genshinGachaChannel'),
        data: defaultLangCode === 'ru' ? CHANNEL_LINK_RU : CHANNEL_LINK_EU,
        type: BUTTON_TYPE_URL,
      },
    ],
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

export function getMainLinks({
  $t,
  defaultLangCode,
}) {
  return [
    [
      {
        message: $t('phrases.genshinGachaChat'),
        data: CHAT_LINK,
        type: BUTTON_TYPE_URL,
      },
    ],
    [
      {
        message: $t('phrases.genshinGachaChannel'),
        data: defaultLangCode === 'ru' ? CHANNEL_LINK_RU : CHANNEL_LINK_EU,
        type: BUTTON_TYPE_URL,
      },
    ],
  ];
}

export function getSettingsButtons({
  $t,
  userData,
  languages,
  languageCode,
  defaultLangCode,
}) {
  return [
    ...languages.map((data) => (
      [
        {
          message: languageCode === data.code
            ? `${data.name} ✅`
            : data.name,
          data: `${SETTINGS_ACTION_KEY} ow:${userData.chatId} cd:${data.code}`,
        },
      ]
    )),
    [
      {
        message: userData.gifEnable ? 'GIF Enabled ✅' : 'GIF Disabled ☑️',
        data: `${SETTINGS_ACTION_KEY} ow:${userData.chatId} gif:${!userData.gifEnable}`,
      },
    ],
    [
      {
        message: userData.notificationsEnable ? 'Notifications Enabled ✅' : 'Notifications Disabled ☑️',
        data: `${SETTINGS_ACTION_KEY} ow:${userData.chatId} not:${!userData.notificationsEnable}`,
      },
    ],
    [
      {
        message: $t('phrases.genshinGachaChat'),
        data: CHAT_LINK,
        type: BUTTON_TYPE_URL,
      },
    ],
    [
      {
        message: $t('phrases.genshinGachaChannel'),
        data: defaultLangCode === 'ru' ? CHANNEL_LINK_RU : CHANNEL_LINK_EU,
        type: BUTTON_TYPE_URL,
      },
    ],
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

export function getPromocodesButtons({
  $t,
  promocodeSuccess,
  defaultLangCode,
}) {
  if (!promocodeSuccess) {
    return [
      [
        {
          message: $t('phrases.genshinGachaChat'),
          data: CHAT_LINK,
          type: BUTTON_TYPE_URL,
        },
      ],
      [
        {
          message: $t('phrases.genshinGachaChannel'),
          data: defaultLangCode === 'ru' ? CHANNEL_LINK_RU : CHANNEL_LINK_EU,
          type: BUTTON_TYPE_URL,
        },
      ],
    ];
  }
  return [];
}

export function getPrimogemsButtons({
  $t,
  chatId,
  defaultLangCode,
}) {
  return [
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${PROFILE_WITHOUT_UPDATE_ACTION_KEY} ow:${chatId}`,
      },
    ],
    [
      {
        message: $t('phrases.genshinGachaChannel'),
        data: defaultLangCode === 'ru' ? CHANNEL_LINK_RU : CHANNEL_LINK_EU,
        type: BUTTON_TYPE_URL,
      },
    ],
  ];
}
