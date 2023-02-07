import _ from 'lodash';

import {
  USERS_HISTORY_ACTION_WISH,
} from '../constants/index.js';

import * as itemsHelper from './itemsHelper.js';
import * as timesHelper from './timeHelper.js';

export function addingDataToLogsForTemplate(historyData, languageCode, defaultLangCode) {
  return historyData.map(({ _doc }) => {
    const log = _.clone(_doc);

    log.year = _doc.created.getFullYear();
    log.day = timesHelper.addingZero(_doc.created.getDate());
    log.month = timesHelper.addingZero(_doc.created.getMonth() + 1);
    log.hours = timesHelper.addingZero(_doc.created.getHours());
    log.minutes = timesHelper.addingZero(_doc.created.getMinutes());

    if (log.action === USERS_HISTORY_ACTION_WISH) {
      log.itemData = itemsHelper.getItemData({
        languageCode,
        defaultLangCode,
        objKey: _doc.objKey,
        type: _doc.type,
      });
    }

    return log;
  });
}
