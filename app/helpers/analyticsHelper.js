import UsersByBots from '../models/usersByBots.js';
import GroupsByBots from '../models/groupsByBots.js';

export function configureTelegramUsersForNotifications({ chatId, isActive, defaultLangCode }) {
  return UsersByBots.findOne({
    chatId,
    defaultLangCode,
  })
    .then((userConfig) => {
      if (userConfig) {
        if (userConfig.isActive !== isActive) {
          // eslint-disable-next-line no-param-reassign
          userConfig.isActive = isActive;
          return userConfig.save();
        }
        return userConfig;
      }
      return new UsersByBots({
        chatId,
        isActive,
        defaultLangCode,
      })
        .save();
    });
}

export function configureTelegramGroupsForNotifications({ groupChatId, isActive, defaultLangCode }) {
  return GroupsByBots.findOne({
    groupChatId,
    defaultLangCode,
  })
    .then((groupConfig) => {
      if (groupConfig) {
        if (groupConfig.isActive !== isActive) {
          // eslint-disable-next-line no-param-reassign
          groupConfig.isActive = isActive;
          return groupConfig.save();
        }
        return groupConfig;
      }
      return new GroupsByBots({
        groupChatId,
        isActive,
        defaultLangCode,
      })
        .save();
    });
}
