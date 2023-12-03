import _ from 'lodash';

export function update(obj, fields) {
  for (const { key, value } of fields) {
    _.set(obj, key, value);
  }
  return obj;
}

export function makeKeyValueArray(object, keyName = 'key', valueName = 'value') {
  return Object.keys(object).map((key) => ({
    [keyName]: key,
    [valueName]: object[key],
  }));
}

export function makeObjectFromKeyValueArray(keyValueArray, keyName = 'key', valueName = 'value') {
  return keyValueArray.map((item) => ({
    [_.result(item, keyName)]: _.result(item, valueName),
  }));
}

export function orderArrayByValue(array, order = 'desc') {
  return _.orderBy(array, ['value'], [order]);
}

export function assignNumbersInObjects(arrayOfObjects) {
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
}

export function incrementNumberWithLimit(numberParam, limitParam) {
  const number = Number(numberParam);
  const limit = Number(limitParam);
  if (number + 1 <= limit) {
    return number + 1;
  }
  return 1;
}

export function paginateArray(array, page, pageSize) {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}
