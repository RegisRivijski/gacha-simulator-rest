import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
  chatId: {
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
export default mongoose.model('usersByBots', itemsSchema);
