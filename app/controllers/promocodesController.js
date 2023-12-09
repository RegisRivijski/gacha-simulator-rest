import ejs from 'ejs';

import Translates from '../classes/Translates.js';
import PromocodesModel from '../models/genshinImpactTgBot/promocodes.js';

import * as minify from '../helpers/minify.js';
import * as userHelper from '../helpers/usersHelper.js';
import * as telegramButtons from '../helpers/telegramButtons.js';

export async function getTgBotPromocode(ctx, next) {
  const { chatId } = ctx.request.params;
  const { promocode } = ctx.request.query;

  ctx.assert(chatId, 400, 'chatId is required');

  const { userData } = await userHelper.getUserData(chatId)
    .catch((e) => {
      console.error('[ERROR] userController getTgBotPromocode UsersModel findOne:', e.message);
      ctx.throw(500);
    });
  ctx.assert(userData?.chatId, 404, 'User not found.');

  const { languageCode } = userData;
  const translates = new Translates(languageCode, ctx.state.defaultLangCode);
  const $t = translates.getTranslate();

  let promocodeData;
  let promocodeSuccess = false;
  let howManyPromocodesCanActive = 0;
  if (promocode) {
    promocodeData = await PromocodesModel.findOne({
      promocode,
    })
      .catch((e) => {
        console.error('[ERROR] app/controllers/userController getTgBotPromocode Promocodes.findOne:', e.message);
      });
  }

  if (promocodeData?.count > 0 && !promocodeData?.chatIds?.includes(userData.chatId)) {
    userData.primogems += promocodeData.primogems;
    userData.starglitter += promocodeData.starglitter;
    userData.stardust += promocodeData.stardust;

    await userData.save()
      .catch((e) => {
        console.error('[ERROR] app/controllers getTgBotPromocode userData.save', e.message);
        ctx.throw(500);
      });

    promocodeData.count -= 1;
    promocodeData.chatIds.push(userData.chatId);

    await promocodeData.save()
      .catch((e) => {
        console.error('[ERROR] app/controllers/userController promocodeData.save', e.message);
      });

    promocodeSuccess = true;
  }

  if (!promocodeSuccess) {
    const allPromocodes = await PromocodesModel.find({})
      .catch((e) => {
        console.error('[ERROR] app/controllers/promocodesController getTgBotPromocodes find({})', e.message);
        return [];
      });
    for (const promocodeDataItem of allPromocodes) {
      if (promocodeDataItem?.count > 0 && !promocodeDataItem?.chatIds?.includes(userData.chatId)) {
        howManyPromocodesCanActive += 1;
      }
    }
  }

  let messageTemplate = await ejs.renderFile('./templates/tgBot/promocodes.ejs', {
    $t,
    userData,
    promocode,
    promocodeData,
    promocodeSuccess,
    howManyPromocodesCanActive,
  });

  messageTemplate = minify.minifyTgBot(messageTemplate);

  ctx.body = {
    userData,
    messageTemplate,
    media: {
      mediaMarkupButtons: telegramButtons.getPromocodesButtons({
        $t,
        promocodeSuccess,
      }),
    },
  };

  await next();
}

export async function getAllPromocodes(ctx, next) {
  const allPromocodes = await PromocodesModel.find({})
    .catch((e) => {
      console.error('[ERROR] app/controllers/promocodesController.js getAllPromocodes find:', e.message);
      ctx.throw(500);
    });

  ctx.body = allPromocodes;
  ctx.status = 200;
  await next();
}

export async function getPromocodeById(ctx, next) {
  const promocodeId = ctx.request.params.id;

  ctx.assert(promocodeId, 400, 'id is required');

  const promocodeData = await PromocodesModel.findOne({ _id: promocodeId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/promocodesController.js getPromocodeById findOne:', e.message);
      ctx.throw(500);
    });

  ctx.assert(promocodeData, 404);

  ctx.body = promocodeData;
  ctx.status = 200;
  await next();
}

export async function changePromocodeById(ctx, next) {
  let { promocodeData } = ctx.request.body;

  const promocodeId = promocodeData?._id;

  ctx.assert(promocodeId, 400, 'promocodeData._id is required');

  promocodeData = await PromocodesModel.findOneAndUpdate({ _id: promocodeId }, promocodeData, { new: true })
    .catch((e) => {
      console.error('[ERROR] app/controllers/promocodesController.js changePromocodeById findOne:', e.message);
      ctx.throw(500);
    });

  ctx.body = promocodeData;
  ctx.status = 200;
  await next();
}

export async function createPromocode(ctx, next) {
  let { promocodeData } = ctx.request.body;

  ctx.assert(promocodeData.promocode, 400, 'promocode is required');

  try {
    promocodeData = new PromocodesModel(promocodeData);
  } catch (e) {
    console.error('[ERROR] app/controllers/promocodesController createPromocode new PromocodesModel:', e.message);
    ctx.throw(500);
  }

  await promocodeData.save()
    .catch((e) => {
      console.error('[ERROR] app/controllers/promocodesController createPromocode save:', e.message);
      ctx.throw(500);
    });

  ctx.body = promocodeData;
  ctx.status = 200;
  await next();
}

export async function deletePromocode(ctx, next) {
  const promocodeId = ctx.request.params.id;

  ctx.assert(promocodeId, 400, 'promocodeId is required');

  await PromocodesModel.deleteOne({ _id: promocodeId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/promocodesController deletePromocode deleteOne:', e.message);
      ctx.throw(500);
    });

  ctx.status = 204;
  await next();
}
