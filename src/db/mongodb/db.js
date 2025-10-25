import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/booksdb';

function initMongo() {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
  }

  return mongoose;
}

export const mongo = initMongo();
