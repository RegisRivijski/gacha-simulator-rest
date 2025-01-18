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
import * as promocodesController from '../controllers/promocodesController.js';
import * as advertisementsController from '../controllers/advertisementsController.js';
import * as shopController from '../controllers/shopController.js';
import * as premiumController from '../controllers/premiumController.js';

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
  .get('/tg-bot/user/:chatId/leaderboard/:page', userController.getTgBotLeaderboard)

  .get('/tg-bot/user/:chatId/primogems', userController.getTgBotPrimogems)
  .get('/tg-bot/user/:chatId/referral', userController.getTgBotReferral)
  .get('/tg-bot/user/:chatId/promocode', promocodesController.getTgBotPromocode)
  .get('/tg-bot/user/:chatId/wish', wishController.getWish)
  .get('/tg-bot/user/:chatId/wish-x10', wishController.getWishX10)

  .get('/tg-bot/user/:chatId/shop', shopController.getTgBotShopItems)
  .get('/tg-bot/user/:chatId/shop/:id', shopController.getTgBotBuyShopItems)
  .get('/tg-bot/user/:chatId/shop/:id/proceed', shopController.getTgBotProceedPayment)

  .get('/tg-bot/user/:chatId/premium', premiumController.getTgBotPremium)
  .get('/tg-bot/user/:chatId/premium/:id', premiumController.getTgBotBuyPremium)
  .get('/tg-bot/user/:chatId/premium/:id/proceed', premiumController.getTgBotProceedPayment)
  .get('/tg-bot/user/:chatId/daily', premiumController.getTgBotPremiumDaily)

  .get('/tg-bot/user/:chatId/start', mainController.start)
  .get('/tg-bot/user/:chatId/help', mainController.help)
  .get('/tg-bot/user/:chatId/settings', mainController.settings)
  .get('/tg-bot/user/:chatId/support', mainController.support)
  .get('/tg-bot/user/:chatId/terms', mainController.terms)

  .get('/:languageCode/translate', templatesController.getTranslate)

  .get('/cron/active-users', cronController.getAllActiveUsers)
  .get('/cron/active-groups', cronController.getAllActiveGroups)
  .get('/cron/primogems-limit', cronController.getAllActiveUsersWithPrimogemsLimit)
  .get('/cron/active-advertisement', advertisementsController.getActiveAdvertisement)
  .put('/cron/advertisements', advertisementsController.changeAdvertisementById)

  .post('/payments/successful', shopController.createSuccessfulPayments)

  .post('/automation/promocodes', promocodesController.createPromocode)

  .post('/analytics/active-telegram-bot', analyticsController.activeTelegramBot)

  .post('/admin', adminController.addAdmin);

export const publicRouter = new Router()
  .use(koaBody())
  .use(headers.getAuthorization)

  .get('/', systemController.about)
  .get('/ping', systemController.ping)
  .get('/memory', systemController.memory)

  .post('/admin/login', adminAuthController.loginAction)
  .post('/admin/exit', securityMiddlewares.session, adminAuthController.exit)
  .get('/admin/me', securityMiddlewares.session, adminAuthController.me)

  .get('/banners-all', securityMiddlewares.session, bannersController.getAllBanners)
  .get('/banners/:id', securityMiddlewares.session, bannersController.getBannersById)
  .delete('/banners/:id', securityMiddlewares.session, bannersController.deleteBanners)
  .post('/banners', securityMiddlewares.session, bannersController.createBanners)
  .put('/banners', securityMiddlewares.session, bannersController.changeBannersById)

  .get('/promocodes-all', securityMiddlewares.session, promocodesController.getAllPromocodes)
  .get('/promocodes/:id', securityMiddlewares.session, promocodesController.getPromocodeById)
  .delete('/promocodes/:id', securityMiddlewares.session, promocodesController.deletePromocode)
  .post('/promocodes', securityMiddlewares.session, promocodesController.createPromocode)
  .put('/promocodes', securityMiddlewares.session, promocodesController.changePromocodeById)

  .get('/advertisements-all', securityMiddlewares.session, advertisementsController.getAllAdvertisement)
  .get('/advertisements/:id', securityMiddlewares.session, advertisementsController.getAdvertisementById)
  .delete('/advertisements/:id', securityMiddlewares.session, advertisementsController.deleteAdvertisement)
  .post('/advertisements', securityMiddlewares.session, advertisementsController.createAdvertisement)
  .put('/advertisements', securityMiddlewares.session, advertisementsController.changeAdvertisementById)

  .get('/shop-items-all', securityMiddlewares.session, shopController.getAllShopItems)
  .get('/shop-items/:id', securityMiddlewares.session, shopController.getShopItemById)
  .put('/shop-items', securityMiddlewares.session, shopController.changeShopItemById)
  .delete('/shop-items/:id', securityMiddlewares.session, shopController.deleteShopItem)
  .post('/shop-items', securityMiddlewares.session, shopController.createShopItem)

  .get('/analytics/users-and-group-chats-list', analyticsController.getUsersAndGroupChatsList)
  .get('/analytics/users-and-group-chats', analyticsController.getUsersAndGroupChats);
