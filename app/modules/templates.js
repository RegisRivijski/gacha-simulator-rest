const fs = require('fs');

module.exports = {
  tgBot: {
    history: fs.readFileSync('./templates/tg-bot/history.ejs', 'utf-8'),
    inventory: fs.readFileSync('./templates/tg-bot/inventory.ejs', 'utf-8'),
    profile: fs.readFileSync('./templates/tg-bot/profile.ejs', 'utf-8'),
    wish: fs.readFileSync('./templates/tg-bot/wish.ejs', 'utf-8'),
    wishX10: fs.readFileSync('./templates/tg-bot/wishX10.ejs', 'utf-8'),
  },
};
