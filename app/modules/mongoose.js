import mongoose from 'mongoose';
import config from '../../config/default.js';

export default function connect() {
  mongoose.connection.on('open', () => {
    console.info('Successfully connected to database.');
  });

  mongoose.connection.on('error', () => {
    throw new Error('Could not connect to MongoDB.');
  });

  return mongoose.connect(config.db.mongodb.url, config.db.mongodb.options);
}
