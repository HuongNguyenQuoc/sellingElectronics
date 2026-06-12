import cors from 'cors';
/* The goal right here is allow frontend to access
backend without CORS issues, especially when 
they are on different domains or ports.*/
import dotenv from 'dotenv'; // Used to load environment variables from a .env file into process.env
import express, { type Express, type Request, type Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';


import orderRoutes from './routes/orderRoutes';

import { connectDB } from './config/db';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import messageRoutes from './routes/messageRoutes'
import { IMessage } from './models/Message';
import { sendMessageService } from './services/message.service';

import dns from 'dns';


dns.setServers([
  '8.8.8.8',
  '8.8.4.4'
]);

dotenv.config();
// Load environment variables from .env file into process.env . Ex: console.log(process.env.MONGO_URI) to check if it's loaded correctly

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = 'http://localhost:5173';

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);

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

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Connected');

  socket.on('john_room',(data) =>{
    const { userId } = data;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    socket.join(userId);
    // john can also emit a message to himself to confirm the connection
  });

  socket.on('send_message', async (data: IMessage) => {
    console.log('🔥 send_message triggered');           // Có chạy vào đây không?
    console.log('📨 Data:', JSON.stringify(data)); 
      try{
        console.log('dsfs');
        const messageData = await sendMessageService(data)
        // Emit the message to the receiver's room
        io.to(data.receiverId).emit('receive_message',messageData);
        socket.emit('message_sent',messageData);
      }catch(error){
        console.error('Send message error:', error);
        console.log(error);
        socket.emit('message_error',{
          message:'Send message failed'
        });
      }
  });

  socket.onAny((event, ...args) => {
    console.log(`📨 Event nhận được: "${event}"`, args);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO server is running on port ${PORT}`);
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