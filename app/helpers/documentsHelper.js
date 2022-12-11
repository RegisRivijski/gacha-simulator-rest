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

  makeKeyValueArray(object, keyName = 'key', valueName = 'value') {
    return Object.keys(object).map((key) => ({
      [keyName]: key,
      [valueName]: object[key],
    }));
  },

  makeObjectFromKeyValueArray(keyValueArray, keyName = 'key', valueName = 'value') {
    const object = {};
    for (const item of keyValueArray) {
      const key = _.result(item, keyName);
      object[key] = _.result(item, valueName);
    }
    return object;
  },

  orderArrayByValue(array, order = 'desc') {
    return _.orderBy(array, ['value'], [order]);
  },

  multiplyAllNumbersInObject(object, number) {
    const multipliedObject = _.clone(object);
    for (const key of Object.keys(multipliedObject)) {
      if (_.isNumber(multipliedObject[key])) {
        multipliedObject[key] *= number;
      }
    }
    return multipliedObject;
  },

  assignNumbersInObjects(arrayOfObjects) {
    const assignedObject = {};
    for (const object of arrayOfObjects) {
      for (const key of Object.keys(object)) {
        if (_.isNumber(object[key])) {
          if (!assignedObject[key]) {
            assignedObject[key] = 0;
          }
          assignedObject[key] += object[key];
        }
      }
    }
    return assignedObject;
  },

  assignNumbersInObjectFromKeyValueArray(keyValueArray) {
    const object = keyValueArray.map((item) => this.makeObjectFromKeyValueArray(item));
    return this.assignNumbersInObjects(object);
  },

  incrementNumberWithLimit(numberParam, limitParam) {
    const number = Number(numberParam);
    const limit = Number(limitParam);
    if (number + 1 <= limit) {
      return number + 1;
    }
    return 1;
  },
};
