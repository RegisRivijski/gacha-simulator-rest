import mongoose from 'mongoose';

const usersMembershipSchema = new mongoose.Schema({
  chatId: {
    type: Number,
  },
  groupChatId: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
  },
});

export default mongoose.model('usersmembership', usersMembershipSchema);
