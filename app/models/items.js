import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

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
export default mongoose.model('items', itemsSchema);
