import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

const AutoIncrement = mongooseSequence(genshinImpactTgBot);

const historySchema = new mongoose.Schema({
  historyId: {
    type: Number,
  },
  chatId: {
    type: Number,
  },
  action: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
  },
  type: {
    type: String,
  },
  objKey: {
    type: String,
  },
  currency: {
    type: String,
  },
  currencyCount: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
historySchema.plugin(AutoIncrement, {
  id: 'historyId_seq',
  inc_field: 'historyId',
});
export default genshinImpactTgBot.model('histories', historySchema);
