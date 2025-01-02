import mongoose from 'mongoose';

import { genshinImpactTgBot } from '../../modules/mongoose.js';

const successfulPayments = new mongoose.Schema({
  currency: {
    type: String,
  },
  total_amount: {
    type: Number,
    default: 0,
  },
  invoice_payload: {
    type: String,
  },
  telegram_payment_charge_id: {
    type: String,
  },
  provider_payment_charge_id: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default genshinImpactTgBot.model('successfulPayments', successfulPayments);
