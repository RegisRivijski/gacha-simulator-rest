import mongoose from 'mongoose';

const itemsSchema = new mongoose.Schema({
  chatId: {
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
export default mongoose.model('usersByBots', itemsSchema);
