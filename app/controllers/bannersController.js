import BannersModel from '../models/genshinImpactStaticData/banners.js';

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

export async function getBannersDataByObjKey(ctx, next) {
  const objKey = ctx.request.query;

  const bannerData = await BannersModel.findOne({ objKey })
    .catch((e) => {
      console.error('[ERROR] app/controllers/bannersController.js getBannersDataByObjKey findOne:', e.message);
      ctx.throw(500);
    });

  ctx.assert(bannerData, 404);

  ctx.body = bannerData;
  ctx.status = 200;
  await next();
}
