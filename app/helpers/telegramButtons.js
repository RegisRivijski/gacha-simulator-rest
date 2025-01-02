/* eslint max-len: 0 */

import * as actions from '../constants/actions.js';
import * as actionsData from '../constants/actionsData.js';

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
        data: `${actions.WISH_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
    ];
  }
  return [
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${actions.PROFILE_WITHOUT_UPDATE_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
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
        data: `${actions.WISH_10_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
    ];
  }
  return [
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${actions.PROFILE_WITHOUT_UPDATE_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
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
        data: `${actions.PROFILE_PRIMOGEMS_GET_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
    ]);
  }
  markupButtons.push(
    [
      {
        message: `${$t('banners.change')} 💫`,
        data: `${actions.PROFILE_CHANGE_BANNER_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
    ],
    [
      {
        message: `${$t('users.inventory.name')} 🎒`,
        data: `${actions.INVENTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
      {
        message: `${$t('users.history.name')} 📖`,
        data: `${actions.HISTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
    ],
    [
      {
        message: `🏆 ${$t('users.leaderboard.globalTitle')} ✦ 🏆`,
        data: `${actions.LEADERBOARD_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
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
      data: `${actions.PROFILE_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
    },
    {
      message: `${$t('users.history.name')} 📖`,
      data: `${actions.HISTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
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
      data: `${actions.HISTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${page - 1}`,
    });
  }

  pagination.push({
    message: `${$t('users.history.page')} ${page + 1}`,
    data: `${actions.HISTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${
      page === 0
        ? pagesCount - 1
        : 0
    }`,
  });

  if (page + 1 < pagesCount) {
    pagination.push({
      message: arrowForward,
      data: `${actions.HISTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${page + 1}`,
    });
  }
  return [
    pagination,
    [
      {
        message: `${$t('users.profile.name')} ✨`,
        data: `${actions.PROFILE_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
      },
      {
        message: `${$t('users.inventory.name')} 🎒`,
        data: `${actions.INVENTORY_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
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
  clearState = 0,
}) {
  let clearButtonMessage = 'Clear Inventory 🗑️';

  if (clearState === 1) {
    clearButtonMessage = 'Are you sure? 🗑️❓';
  } else if (clearState === 2) {
    clearButtonMessage = 'Confirm Clear 🗑️✅';
  }

  return [
    ...languages.map((data) => (
      [
        {
          message: languageCode === data.code
            ? `${data.name} ✅`
            : data.name,
          data: `${actions.SETTINGS_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${userData.chatId} ${actionsData.SETTINGS_LANGUAGE_CODE}:${data.code}`,
        },
      ]
    )),
    [
      {
        message: userData.gifEnable ? 'GIF Enabled ✅' : 'GIF Disabled ☑️',
        data: `${actions.SETTINGS_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${userData.chatId} ${actionsData.SETTINGS_GIF_ENABLE}:${!userData.gifEnable}`,
      },
    ],
    [
      {
        message: userData.notificationsEnable ? 'Notifications Enabled ✅' : 'Notifications Disabled ☑️',
        data: `${actions.SETTINGS_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${userData.chatId} ${actionsData.SETTINGS_NOTIFICATION_ENABLE}:${!userData.notificationsEnable}`,
      },
    ],
    [
      {
        message: clearButtonMessage,
        data: `${actions.SETTINGS_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${userData.chatId} ${actionsData.SETTINGS_CLEAR_INVENTORY}:${clearState + 1}`,
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
      data: `${actions.PROFILE_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
    },
  ];

  if (page > 0) {
    pagination.push({
      message: arrowBack,
      data: `${actions.LEADERBOARD_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${page - 1}`,
    });
  }

  pagination.push({
    message: `${$t('users.history.page')} ${page + 1}`,
    data: `${actions.LEADERBOARD_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${
      page === 0
        ? pagesCount - 1
        : 0
    }`,
  });

  if (page + 1 < pagesCount) {
    pagination.push({
      message: arrowForward,
      data: `${actions.LEADERBOARD_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${page + 1}`,
    });
  }

  if (page !== pageWithMe && pageWithMe >= 0 && pageWithMe < pagesCount) {
    buttons.push({
      message: `${$t('users.leaderboard.showMe')} 🔍️️️️️️`,
      data: `${actions.LEADERBOARD_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId} ${actionsData.PAGINATION_PAGE}:${pageWithMe}`,
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
        data: `${actions.PROFILE_WITHOUT_UPDATE_ACTION_KEY} ${actionsData.OWNER_CHAT_ID}:${chatId}`,
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

export function getShopButtons({ $t, shopItems }) {
  return shopItems.map((item) => [
    {
      message: `Telegram Stars ${item.starsCost} ⭐️ - ${item.count} ${$t(`shop.currency.${item.currencyType}`)} ${$t(`currency.${item.currencyType}`)}`,
      data: `${actions.SHOP_BUY_ITEM_ACTION_KEY} ${actionsData.SHOP_ITEM_ID}:${item.shopItemId}`,
    },
  ]);
}
