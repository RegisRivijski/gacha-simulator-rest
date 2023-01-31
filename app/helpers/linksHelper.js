import {
  STANDARD_BANNER_TYPE_NAME,
  CHARACTERS_BANNER_TYPE_NAME,
  WEAPONS_BANNER_TYPE_NAME,
} from '../constants/index.js';

import config from '../../config/default.js';

const arturOrigin = `${config.rest.artur.protocol}//${config.rest.artur.host}`;

export function getItemImage({
  translates,
  itemType,
  objKey,
}) {
  const imageLangCode = translates.validateLangCodeForImages();
  const imageItemType = encodeURIComponent(itemType);
  const imageObjKey = encodeURIComponent(objKey);
  if (imageLangCode && itemType && objKey) {
    return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/items/${imageLangCode}/${imageItemType}/${imageObjKey}.png`;
  }
  return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/blankGachaSplash.jpg`;
}

export function getLinkToFatesSticker(currentBannerType) {
  switch (currentBannerType) {
    case STANDARD_BANNER_TYPE_NAME:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/fates/default.webp`;
    case CHARACTERS_BANNER_TYPE_NAME:
    case WEAPONS_BANNER_TYPE_NAME:
    default:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/fates/event.webp`;
  }
}

export function getLinkToWishGif(newItemRarity) {
  switch (Number(newItemRarity)) {
    case 4:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/animation/wish/4starwish.mp4`;
    case 5:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/animation/wish/5starwish.mp4`;
    case 3:
    default:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/animation/wish/3starwish.mp4`;
  }
}

export function getLinkToWishX10Gif(newItemRarity) {
  switch (Number(newItemRarity)) {
    case 5:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/animation/wish/5starwish_10.mp4`;
    case 4:
    default:
      return `${arturOrigin}/public/gacha-simulator-static-data/assets/animation/wish/4starwish_10.mp4`;
  }
}

export function getLinkForGetPrimogems(primogemsAdded) {
  if (primogemsAdded) {
    return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/currencies/primogems.webp`;
  }
  return `${arturOrigin}/public/img/gacha-simulator/stickers/sadPaimon.webp`;
}

export function getLinkForStart() {
  return `${arturOrigin}/public/img/gacha-simulator/main/start.jpg`;
}
