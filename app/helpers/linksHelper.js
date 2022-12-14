import config from '../../config/default.js';

import { validateLangCodeForImages } from './translatesHelper.js';

const arturOrigin = `${config.rest.artur.protocol}//${config.rest.artur.host}`;

export function getItemImage({
  languageCode,
  itemType,
  objKey,
}) {
  const imageLangCode = validateLangCodeForImages(languageCode);
  const imageItemType = encodeURIComponent(itemType);
  const imageObjKey = encodeURIComponent(objKey);
  if (imageLangCode && itemType && objKey) {
    return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/items/${imageLangCode}/${imageItemType}/${imageObjKey}.png`;
  }
  return `${arturOrigin}/public/gacha-simulator-static-data/assets/img/blankGachaSplash.jpg`;
}
