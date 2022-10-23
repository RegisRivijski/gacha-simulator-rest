const mongoose = require('mongoose');

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
  created: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('groups', groupChatsSchema);
