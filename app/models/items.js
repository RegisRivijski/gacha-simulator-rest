const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const itemsSchema = new mongoose.Schema({
  itemId: {
    type: Number,
  },
  chatId: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: '',
  },
  objKey: {
    type: String,
    default: '',
  },
  count: {
    type: Number,
    default: 1,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
itemsSchema.plugin(AutoIncrement, {
  id: 'itemId_seq',
  inc_field: 'itemId',
});
module.exports = mongoose.model('items', itemsSchema);
