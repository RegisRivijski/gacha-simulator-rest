const fs = require('fs');
const ejs = require('ejs');

const staticDataHelper = require('../helpers/staticDataHelper');
const translatesHelper = require('../helpers/translatesHelper');

const historyTemplate = fs.readFileSync('./app/templates/history.ejs', 'utf-8');
const inventoryTemplate = fs.readFileSync('./app/templates/inventory.ejs', 'utf-8');
const profileTemplate = fs.readFileSync('./app/templates/profile.ejs', 'utf-8');

module.exports = {
  history({ userData, historyData }) {
    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);
    return ejs.render(historyTemplate, { $t, userData, historyData });
  },

  inventory({ userData, itemsData }) {
    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);
    return ejs.render(inventoryTemplate, { $t, userData, itemsData });
  },

  profile({ userData }) {
    const { languageCode } = userData;
    const $t = translatesHelper.getTranslate(languageCode);
    return ejs.render(profileTemplate, { $t, userData });
  },
};
