import mongoose from 'mongoose';

/**
 * Connect to MongoDB database.
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI)
      throw new Error('MONGO_URI is not defined in environment variables');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    // keep original behavior but print full stack/object for easier debugging
    process.exit(1);
  }
};
