const _ = require('lodash');

const {
  USERS_HISTORY_ACTION_WISH,
} = require('../constants/index');

const itemsHelper = require('./itemsHelper');
const timesHelper = require('./timeHelper');

module.exports = {
  addingDataToLogsForTemplate(historyData, langCode) {
    return historyData.map(({ _doc }) => {
      const log = _.clone(_doc);

      log.year = _doc.created.getFullYear();
      log.day = timesHelper.addingZero(_doc.created.getDate());
      log.month = timesHelper.addingZero(_doc.created.getMonth() + 1);
      log.hours = timesHelper.addingZero(_doc.created.getHours());
      log.minutes = timesHelper.addingZero(_doc.created.getMinutes());

      if (log.action === USERS_HISTORY_ACTION_WISH) {
        log.itemData = itemsHelper.getItemData({
          langCode,
          objKey: _doc.objKey,
          type: _doc.type,
        });
      }

      return log;
    });
  },
};
