import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

import { genshinImpactTgBot } from '../../modules/mongoose.js';

const AutoIncrement = mongooseSequence(genshinImpactTgBot);

const shopSchema = new mongoose.Schema({
  shopItemId: {
    type: Number,
    unique: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  count: {
    type: Number,
    required: true,
  },
  currencyType: {
    type: String,
    enum: ['primogems', 'stardust', 'starglitter'],
    default: 'primogems',
  },
  starsCost: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

shopSchema.plugin(AutoIncrement, {
  id: 'shopItemId_seq',
  inc_field: 'shopItemId',
});

export default genshinImpactTgBot.model('shop', shopSchema);
