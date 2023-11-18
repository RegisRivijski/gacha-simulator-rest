import mongoose from 'mongoose';
import { genshinImpactStaticData } from '../../modules/mongoose.js';

export default genshinImpactStaticData.model('banners', new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'character',
  },
  category: {
    type: String,
    default: 'event',
  },
  objKey: {
    type: String,
    default: '',
  },
  translates: {
    type: Object,
    default: {},
  },
  characters: {
    type: Object,
  },
  weapons: {
    type: Object,
  },
}, {
  strict: false,
}));
