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
    type: String,
    default: '',
  },
});
export default mongoose.model('activeUsersByDefaultLanguage', itemsSchema);
