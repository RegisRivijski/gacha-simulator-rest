const {
  USERS_HISTORY_ACTION_WISH,
} = require('../constants/index');

const itemsHelper = require('./itemsHelper');

module.exports = {
  addingStaticData(historyData, langCode) {
    return historyData.map(({ _doc }) => {
      if (_doc.action === USERS_HISTORY_ACTION_WISH) {
        return {
          ..._doc,
          itemData: itemsHelper.getItemData({
            langCode,
            objKey: _doc.objKey,
            type: _doc.type,
          }),
        };
      }
      return _doc;
    });
  },
};
