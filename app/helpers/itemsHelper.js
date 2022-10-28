const _ = require('lodash');

const staticDataHelper = require('./staticDataHelper');

module.exports = {
  getItemData({ langCode, objKey, type }) {
    const itemData = staticDataHelper.getItems({
      langCode,
      type,
    });
    return _.result(itemData, objKey, {});
  },
};
