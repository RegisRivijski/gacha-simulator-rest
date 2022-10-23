const mongoose = require('mongoose');

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

module.exports = mongoose.model('usersmembership', usersMembershipSchema);
