import mongoose from 'mongoose';
import { genshinImpactStaticData } from '../../modules/mongoose.js';

export default genshinImpactStaticData.model('chances', new mongoose.Schema({}, { strict: false }));
