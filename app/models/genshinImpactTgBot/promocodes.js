import mongoose from 'mongoose';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

const promocodesSchema = new mongoose.Schema({
  promocode: {
    type: String,
    default: '',
  },
  chatIds: {
    type: [Number],
    default: [],
  },
  primogems: {
    type: Number,
    default: 0,
  },
  stardust: {
    type: Number,
    default: 0,
  },
  starglitter: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
export default genshinImpactTgBot.model('promocodes', promocodesSchema);
