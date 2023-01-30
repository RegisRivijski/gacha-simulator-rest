import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
  groupChatId: {
    type: Number,
    default: 0,
  },
  botId: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: String,
    default: '',
  },
});
export default mongoose.model('groupsByBots', itemsSchema);
