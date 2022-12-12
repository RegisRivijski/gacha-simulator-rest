const _ = require('lodash');

const documentsHelper = require('./documentsHelper');

module.exports = {
  /**
   * @param wallet { currency_1: value, currency_2: value }
   * @param cost   { currency_1: value, currency_2: value }
   */
  determinePrice(wallet, cost) {
    const prices = documentsHelper.makeKeyValueArray(cost);
    const orderedPrices = documentsHelper.orderArrayByValue(prices);
    for (const price of orderedPrices) {
      const walletValue = _.result(wallet, price.key, 0);
      if (walletValue >= price.value) {
        return price;
      }
    }
    return {};
  },

  /**
   * @param wallet { currency_1: value, currency_2: value }
   * @param cost   { currency_1: value, currency_2: value }
   * @param count  10
   */
  determinePriceFewTimes(wallet, cost, count) {
    const walletCloned = { ...wallet };
    const prices = [];
    for (let i = 0; i < count; i += 1) {
      const price = this.determinePrice(walletCloned, cost);
      if (!_.isEmpty(price)) {
        walletCloned[price.key] -= price.value;
        prices.push(price);
      } else {
        break;
      }
    }
    return prices;
  },
};
