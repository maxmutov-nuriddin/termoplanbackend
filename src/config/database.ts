import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/termoplan';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB muvaffaqiyatli ulandi: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database] MongoDB ga ulanishda ogohlantirish (in-memory/offline fallback faollashadi):`, (error as Error).message);
  }
};
