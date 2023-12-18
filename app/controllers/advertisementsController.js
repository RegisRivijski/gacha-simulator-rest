import AdvertisementModel from '../models/genshinImpactTgBot/advertisement.js';

export async function getActiveAdvertisement(ctx, next) {
  const activeAdvertisement = await AdvertisementModel.findOne({
    delivered: false,
    sendAfter: {
      $lt: Date.now(),
    },
  })
    .catch((e) => {
      console.error('[ERROR] app/controllers/advertisementsController.js getActiveAdvertisement', e.message);
      ctx.throw(500);
    });

  ctx.body = activeAdvertisement || {};
  ctx.status = 200;
  await next();
}

export async function getAllAdvertisement(ctx, next) {
  const allAdvertisement = await AdvertisementModel.find({})
    .catch((e) => {
      console.error('[ERROR] app/controllers/advertisementsController.js getAllAdvertisement find:', e.message);
      ctx.throw(500);
    });

  ctx.body = allAdvertisement;
  ctx.status = 200;
  await next();
}

export async function getAdvertisementById(ctx, next) {
  const advertisementId = ctx.request.params.id;

  ctx.assert(advertisementId, 400, 'id is required');

  const advertisementData = await AdvertisementModel.findOne({ _id: advertisementId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/advertisementsController.js getAdvertisementById findOne:', e.message);
      ctx.throw(500);
    });

  ctx.assert(advertisementData, 404);

  ctx.body = advertisementData;
  ctx.status = 200;
  await next();
}

export async function changeAdvertisementById(ctx, next) {
  let { advertisementData } = ctx.request.body;

  const advertisementId = advertisementData?._id;

  ctx.assert(advertisementId, 400, 'advertisementData._id is required');

  advertisementData = await AdvertisementModel.findOneAndUpdate({ _id: advertisementId }, advertisementData, { new: true })
    .catch((e) => {
      console.error('[ERROR] app/controllers/advertisementsController.js changeAdvertisementById findOne:', e.message);
      ctx.throw(500);
    });

  ctx.body = advertisementData;
  ctx.status = 200;
  await next();
}

export async function createAdvertisement(ctx, next) {
  let { advertisementData } = ctx.request.body;

  ctx.assert(advertisementData.message, 400, 'message is required');

  try {
    advertisementData = new AdvertisementModel(advertisementData);
  } catch (e) {
    console.error('[ERROR] app/controllers/advertisementsController createAdvertisement new AdvertisementModel:', e.message);
    ctx.throw(500);
  }

  await advertisementData.save()
    .catch((e) => {
      console.error('[ERROR] app/controllers/advertisementsController createAdvertisement save:', e.message);
      ctx.throw(500);
    });

  ctx.body = advertisementData;
  ctx.status = 200;
  await next();
}

export async function deleteAdvertisement(ctx, next) {
  const advertisementId = ctx.request.params.id;

  ctx.assert(advertisementId, 400, 'advertisementId is required');

  await AdvertisementModel.deleteOne({ _id: advertisementId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/advertisementsController deleteAdvertisement deleteOne:', e.message);
      ctx.throw(500);
    });

  ctx.status = 204;
  await next();
}
