import Router from 'koa-router';
import koaBody from 'koa-body';

import * as securityMiddlewares from '../middlewares/security.js';
import * as languageMiddlewares from '../middlewares/language.js';

import * as adminController from '../controllers/adminController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import * as groupChatController from '../controllers/groupChatController.js';
import * as systemController from '../controllers/systemController.js';
import * as templatesController from '../controllers/templatesController.js';
import * as userController from '../controllers/userController.js';
import * as wishController from '../controllers/wishController.js';

export const router = new Router()
  .use(koaBody())
  .use(securityMiddlewares.ApiKeysValidator)
  .use(languageMiddlewares.getDefaultLangCode)

  .get('/user/:chatId', userController.getUser)
  .put('/user/:chatId', userController.updateUser)
  .post('/user/:chatId', userController.addUser)

  .get('/group-chat/:groupChatId', groupChatController.getGroupChat)
  .put('/group-chat/:groupChatId', groupChatController.updateGroupChat)
  .post('/group-chat/:groupChatId', groupChatController.addGroupChat)

  .get('/admin/user/:chatId', adminController.getAdmin)
  .put('/admin/user/:chatId', adminController.updateAdmin)
  .post('/admin/user/:chatId', adminController.addAdmin)

  .get('/tg-bot/user/:chatId/profile', userController.getTgBotProfile)
  .get('/tg-bot/user/:chatId/history', userController.getTgBotHistory)
  .get('/tg-bot/user/:chatId/history/:page', userController.getTgBotHistory)
  .get('/tg-bot/user/:chatId/inventory', userController.getTgBotInventory)
  .get('/tg-bot/user/:chatId/primogems', userController.getTgBotPrimogems)
  .get('/tg-bot/user/:chatId/wish', wishController.getWish)
  .get('/tg-bot/user/:chatId/wish-x10', wishController.getWishX10)

  .get('/:languageCode/translate', templatesController.getTranslate);

export const publicRouter = new Router()
  .use(koaBody())
  .get('/', systemController.about)
  .get('/ping', systemController.ping)
  .get('/memory', systemController.memory)

  .get('/analytics/users-and-group-chats', analyticsController.getUsersAndGroupChats)

  .get('/analytics/all-active-users', analyticsController.getAllActiveUsers)
  .get('/analytics/all-active-users-with-primogems-limit', analyticsController.getAllActiveUsersWithPrimogemsLimit);
