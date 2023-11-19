import Router from 'koa-router';
import koaBody from 'koa-body';

import * as securityMiddlewares from '../middlewares/security.js';
import * as headers from '../middlewares/headers.js';

import * as adminAuthController from '../controllers/adminAuthController.js';
import * as adminController from '../controllers/adminController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import * as bannersController from '../controllers/bannersController.js';
import * as cronController from '../controllers/cronController.js';
import * as groupChatController from '../controllers/groupChatController.js';
import * as systemController from '../controllers/systemController.js';
import * as templatesController from '../controllers/templatesController.js';
import * as userController from '../controllers/userController.js';
import * as wishController from '../controllers/wishController.js';
import * as mainController from '../controllers/mainController.js';

export const privateRouter = new Router()
  .use(koaBody())
  .use(securityMiddlewares.ApiKeysValidator)
  .use(headers.getDefaultLangCode)
  .use(headers.getIsAction)

  .get('/user/:chatId', userController.getUser)
  .put('/user/:chatId', userController.updateUser)
  .post('/user/:chatId', userController.addUser)

  .get('/group-chat/:groupChatId', groupChatController.getGroupChat)
  .put('/group-chat/:groupChatId', groupChatController.updateGroupChat)
  .post('/group-chat/:groupChatId', groupChatController.addGroupChat)

  .get('/tg-bot/user/:chatId/profile', userController.getTgBotProfile)
  .get('/tg-bot/user/:chatId/history/:page', userController.getTgBotHistory)
  .get('/tg-bot/user/:chatId/inventory', userController.getTgBotInventory)

  .get('/tg-bot/user/:chatId/primogems', userController.getTgBotPrimogems)
  .get('/tg-bot/user/:chatId/referral', userController.getTgBotReferral)

  .get('/tg-bot/user/:chatId/wish', wishController.getWish)
  .get('/tg-bot/user/:chatId/wish-x10', wishController.getWishX10)

  .get('/tg-bot/user/:chatId/start', mainController.start)
  .get('/tg-bot/user/:chatId/help', mainController.help)
  .get('/tg-bot/user/:chatId/settings', mainController.settings)

  .get('/:languageCode/translate', templatesController.getTranslate)

  .get('/cron/primogems-limit', cronController.getAllActiveUsersWithPrimogemsLimit)
  .get('/cron/how-many-user-can-buy', cronController.getAllActiveUsersHowManyCanBuyWishes)

  .post('/analytics/active-telegram-bot', analyticsController.activeTelegramBot);

export const publicRouter = new Router()
  .use(koaBody())
  .get('/', systemController.about)
  .get('/ping', systemController.ping)
  .get('/memory', systemController.memory)

  .get('/admin/all', adminController.getAdmin)
  .post('/admin', adminController.addAdmin)

  .post('/admin/login', adminAuthController.loginAction)
  .post('/admin/exit', adminAuthController.exit)
  .get('/admin/me', adminAuthController.me)

  .get('/banners-all', securityMiddlewares.session, bannersController.getAllBanners)

  .get('/banners/:id', securityMiddlewares.session, bannersController.getBannersById)
  .delete('/banners/:id', securityMiddlewares.session, bannersController.deleteBanners)
  .post('/banners', securityMiddlewares.session, bannersController.createBanners)
  .put('/banners', securityMiddlewares.session, bannersController.changeBannersById)

  .get('/analytics/users-and-group-chats-list', analyticsController.getUsersAndGroupChatsList)
  .get('/analytics/users-and-group-chats', analyticsController.getUsersAndGroupChats);
