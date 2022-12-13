import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const historySchema = new mongoose.Schema({
  historyId: {
    type: Number,
  },
  chatId: {
    type: Number,
  },
  action: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
  },
  type: {
    type: String,
  },
  objKey: {
    type: String,
  },
  currency: {
    type: String,
  },
  currencyCount: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
historySchema.plugin(AutoIncrement, {
  id: 'historyId_seq',
  inc_field: 'historyId',
});
export default mongoose.model('histories', historySchema);
