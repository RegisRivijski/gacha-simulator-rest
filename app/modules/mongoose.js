import mongoose from 'mongoose';

export default function connect() {
  mongoose.connection.on('open', () => {
    console.info('Successfully connected to database.');
  });

  mongoose.connection.on('error', () => {
    throw new Error('Could not connect to MongoDB.');
  });

  return mongoose.connect(global.CONFIG.db.mongodb.url, global.CONFIG.db.mongodb.options);
}
