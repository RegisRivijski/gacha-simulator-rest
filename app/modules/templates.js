const fs = require('fs');

const templates = {
  tgBot: {
    history: fs.readFileSync('./app/templates/tg-bot/history.ejs', 'utf-8'),
    inventory: fs.readFileSync('./app/templates/tg-bot/inventory.ejs', 'utf-8'),
    profile: fs.readFileSync('./app/templates/tg-bot/profile.ejs', 'utf-8'),
  },
};

module.exports = templates;
