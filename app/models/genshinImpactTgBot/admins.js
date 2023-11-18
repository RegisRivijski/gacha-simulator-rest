import mongoose from 'mongoose';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

export default genshinImpactTgBot.model('admins', new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  adminType: {
    type: Number,
    default: 1,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}));
