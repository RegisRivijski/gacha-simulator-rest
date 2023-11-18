import BannersModel from '../models/genshinImpactStaticData/banners.js';

import * as documentsHelper from '../helpers/documentsHelper.js';

export async function getAllBanners(ctx, next) {
  const allBannersData = await BannersModel.find({})
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController.js getAllBanners find:', e.message);
      ctx.throw(500);
    });

  ctx.body = allBannersData;
  ctx.status = 200;
  await next();
}

export async function getBannersById(ctx, next) {
  const bannerId = ctx.request.params.id;

  ctx.assert(bannerId, 400, 'id is required');

  const bannerData = await BannersModel.findOne({ _id: bannerId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController.js getBannersById findOne:', e.message);
      ctx.throw(500);
    });

  ctx.assert(bannerData, 404);

  ctx.body = bannerData;
  ctx.status = 200;
  await next();
}

export async function changeBannersById(ctx, next) {
  const bannerId = ctx.request.params.id;
  const fieldsToUpdate = ctx.request.body.fields;

  ctx.assert(bannerId, 400, 'id is required');

  let bannerData = await BannersModel.findOne({ _id: bannerId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController.js getBannersDataByObjKey findOne:', e.message);
      ctx.throw(500);
    });

  bannerData = documentsHelper.update(bannerData, fieldsToUpdate);

  await bannerData.save()
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController changeBannersById save:', e.message);
      ctx.throw(500);
    });

  ctx.body = bannerData;
  ctx.status = 200;
  await next();
}

export async function createBanners(ctx, next) {
  let bannerData = ctx.request.body;

  ctx.assert(bannerData.objKey, 400, 'objKey is required');

  try {
    bannerData = new BannersModel(bannerData);
  } catch (e) {
    console.error('[ERROR] app/controllers/bannersController createBanners new BannersModel:', e.message);
    ctx.throw(500);
  }

  await bannerData.save()
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController createBanners save:', e.message);
      ctx.throw(500);
    });

  ctx.body = bannerData;
  ctx.status = 200;
  await next();
}

export async function deleteBanners(ctx, next) {
  const bannerId = ctx.request.params.id;

  ctx.assert(bannerId, 400, 'bannerId is required');

  await BannersModel.deleteOne({ _id: bannerId })
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController deleteBanners deleteOne:', e.message);
      ctx.throw(500);
    });

  ctx.status = 204;
  await next();
}
