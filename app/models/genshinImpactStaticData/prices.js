import mongoose from 'mongoose';
import { genshinImpactStaticData } from '../../modules/mongoose.js';

export default genshinImpactStaticData.model('prices', new mongoose.Schema({}, { strict: false }));
