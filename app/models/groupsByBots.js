import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
  groupChatId: {
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
export default mongoose.model('groupsByBots', itemsSchema);
