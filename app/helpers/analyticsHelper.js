import UsersByBots from '../models/usersByBots.js';
import GroupsByBots from '../models/groupsByBots.js';

export function configureTelegramUsersForNotifications({ chatId, isActive, defaultLanguage }) {
  return UsersByBots.findOne({
    chatId,
    defaultLanguage,
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
        defaultLanguage,
      });
    });
}

export function configureTelegramGroupsForNotifications({ groupChatId, isActive, defaultLanguage }) {
  return GroupsByBots.findOne({
    groupChatId,
    defaultLanguage,
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
        defaultLanguage,
      });
    });
}
