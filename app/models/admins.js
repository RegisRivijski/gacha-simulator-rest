const mongoose = require('mongoose');

module.exports = mongoose.model('admins', new mongoose.Schema({
  chatId: {
    type: Number,
    default: 0,
  },
  adminType: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}));
