const Router = require('koa-router');
const koaBody = require('koa-body');

const securityMiddlewares = require('../middlewares/security');
const systemController = require('../controllers/systemController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const wishController = require('../controllers/wishController');

module.exports = {
  Router() {
    return new Router()
      .use(koaBody())
      .use(securityMiddlewares.ApiKeysValidator)

      .get('/', systemController.about)
      .get('/ping', systemController.ping)
      .get('/memory', systemController.memory)

      .get('/users', userController.getUsers)

      .get('/user/:chatId', userController.getUser)
      .put('/user/:chatId', userController.updateUser)
      .post('/user/:chatId', userController.addUser)

      .get('/user/:chatId/admin', adminController.getAdmin)
      .put('/user/:chatId/admin', adminController.updateAdmin)
      .post('/user/:chatId/admin', adminController.addAdmin)

      .get('/tg-bot/user/:chatId/profile', userController.getTgBotProfile)
      .get('/tg-bot/user/:chatId/history/:page', userController.getTgBotHistory)
      .get('/tg-bot/user/:chatId/inventory', userController.getTgBotInventory)
      .get('/tg-bot/user/:chatId/primogems')
      .get('/tg-bot/user/:chatId/wish', wishController.getWish)
      .get('/tg-bot/user/:chatId/wish-x10', wishController.getWishX10)

      .get('/static/items/:type')
      .get('/static/banners')
      .get('/static/banners/active')
      .get('/static/chances/:type')
      .get('/static/prices/:type');
  },
};
