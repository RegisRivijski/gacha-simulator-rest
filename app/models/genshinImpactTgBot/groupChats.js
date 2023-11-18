import mongoose from 'mongoose';
import { genshinImpactTgBot } from '../../modules/mongoose.js';

const groupChatsSchema = new mongoose.Schema({
  groupChatId: {
    type: Number,
    default: 0,
  },
  groupTitle: {
    type: String,
    default: '',
  },
  groupUsername: {
    type: String,
    default: '',
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
export default genshinImpactTgBot.model('groups', groupChatsSchema);
