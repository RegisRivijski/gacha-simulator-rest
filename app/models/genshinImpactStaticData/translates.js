import mongoose from 'mongoose';
import { genshinImpactStaticData } from '../../modules/mongoose.js';

export default genshinImpactStaticData.model('translates', new mongoose.Schema({}, { strict: false }));
