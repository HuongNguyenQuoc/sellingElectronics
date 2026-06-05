import cors from 'cors';
/* The goal right here is allow frontend to access
backend without CORS issues, especially when 
they are on different domains or ports.*/
import dotenv from 'dotenv'; // Used to load environment variables from a .env file into process.env
import express, { type Express, type Request, type Response } from 'express';

import { connectDB } from './config/db';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();
// Load environment variables from .env file into process.env . Ex: console.log(process.env.MONGO_URI) to check if it's loaded correctly

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);

app.get('/', (_req: Request, res: Response) => {
  // _req is a convention to indicate that the request parameter
  // is not used in this handler.
  res.status(200).json({
    success: true,
    message: 'E-commerce API is running',
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      'Failed to connect database:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

startServer();