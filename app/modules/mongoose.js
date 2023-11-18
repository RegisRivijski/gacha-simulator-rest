import mongoose from 'mongoose';
import config from '../../config/default.js';

export const genshinImpactTgBot = mongoose.createConnection(config.db.mongodb.url, config.db.mongodb.options);

export const genshinImpactStaticData = mongoose.createConnection(config.db.mongodbStatic.url, config.db.mongodbStatic.options);
