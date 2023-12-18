import mongoose from 'mongoose';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

export default genshinImpactTgBot.model('advertisement', new mongoose.Schema({
  imageLink: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  groups: {
    type: Boolean,
    default: true,
  },
  users: {
    type: Boolean,
    default: true,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  sendAfter: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}));
