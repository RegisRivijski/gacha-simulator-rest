const _ = require('lodash');

module.exports = {
  update(obj, fields) {
    for (const { key, value } of fields) {
      if (_.has(obj, key)) {
        _.set(obj, key, value);
      }
    }
    return obj;
  },

  makeKeyValueArray(object) {
    return Object.keys(object).map((key) => ({
      key,
      value: object[key],
    }));
  },
};
