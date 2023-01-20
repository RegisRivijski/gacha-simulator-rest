import _ from 'lodash';
import fs from 'fs';
import path from 'node:path';

import config from '../../config/default.js';

function getTemplates(dirPath, __templatesTree = {}, __setPath = '') {
  const files = fs.readdirSync(dirPath);

  for (const item of files) {
    const fullPath = `${dirPath}/${item}`;
    const baseName = path.basename(fullPath, config.templates.suffix);
    const setPath = __setPath
      ? `${__setPath}.${baseName}`
      : baseName;

    if (fs.statSync(fullPath).isDirectory()) {
      getTemplates(fullPath, __templatesTree, setPath);
    } else {
      _.set(__templatesTree, setPath, fs.readFileSync(fullPath, config.templates.coding));
    }
  }
  return __templatesTree;
}

export default getTemplates(config.templates.path);
