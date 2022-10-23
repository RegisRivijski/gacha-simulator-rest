const Router = require('koa-router');
const koaBody = require('koa-body');

const systemController = require('../controllers/systemController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

module.exports = {
  Router() {
    return new Router()
      .use(koaBody())

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

      .get('/user/:chatId/profile', userController.getProfile)

      .get('/user/:chatId/history', userController.getHistory)

      .get('/user/:chatId/inventory', userController.getInventory)

      .get('/user/:chatId/primogems')

      .get('/user/:chatId/wish')
      .get('/user/:chatId/with-x10')

      .get('/items/:type')

      .get('/static/banners')
      .get('/static/banners/active')
      .get('/static/chances/:type')
      .get('/static/prices/:type');
  },
};
