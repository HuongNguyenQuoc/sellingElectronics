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
    // With strict mode, 'error' is of type 'unknown'. We need to check if it's an Error instance.
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
};
