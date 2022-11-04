const _ = require('lodash');

const documentsHelper = require('./documentsHelper');

module.exports = {
  /**
   * @param wallet { currency_1: value, currency_2: value }
   * @param cost   { currency_1: value, currency_2: value }
   */
  determinePrice(wallet, cost) {
    const prices = documentsHelper.makeKeyValueArray(cost);
    const orderedPrices = _.orderBy(prices, ['value'], ['desc']);
    for (const price of orderedPrices) {
      if (price.key in wallet && wallet[price.key] >= price.value) {
        return {
          currency: price.key,
          cost: price.value,
        };
      }
    }
    return {};
  },
};
