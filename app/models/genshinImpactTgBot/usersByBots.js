import mongoose from 'mongoose';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

const itemsSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    default: 0,
  },
  defaultLangCode: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
export default genshinImpactTgBot.model('usersByBots', itemsSchema);
