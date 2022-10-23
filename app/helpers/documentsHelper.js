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
};
