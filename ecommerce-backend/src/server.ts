import cors from 'cors';
/* The goal right here is allow frontend to access
backend without CORS issues, especially when 
they are on different domains or ports.*/
import dotenv from 'dotenv'; // Used to load environment variables from a .env file into process.env
import express, { type Express, type Request, type Response } from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

import conversationRoutes from './routes/conversationRoutes';
import orderRoutes from './routes/orderRoutes';

import { connectDB } from './config/db';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import { User } from './models/User';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import productRoutes from './routes/productRoutes';
import { createOrUpdateConversationService } from './services/conversation.service';
import { sendMessageService } from './services/message.service';

import dns from 'dns';
import cartRoutes from './routes/cartRoutes';
import { SendChatMessageDto, SendMessageDto } from './dtos/message.dto';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
// Load environment variables from .env file into process.env . Ex: console.log(process.env.MONGO_URI) to check if it's loaded correctly

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
const VERCEL_PREVIEW_URL =
  /^https:\/\/techvolt-[a-z0-9-]+-huongnguyenquocs-projects\.vercel\.app$/i;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);

app.use('/api/carts', cartRoutes);

app.use('/api/conversations', conversationRoutes);

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
    // Vercel generates a new preview hostname for every deployment.
    origin: [FRONTEND_URL, VERCEL_PREVIEW_URL],
    methods: ['GET', 'POST'],
  },
});

const ADMIN_ROOM = 'admin';

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token || !process.env.JWT_SECRET) {
      return next(new Error('Unauthorized'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) return next(new Error('Unauthorized'));

    socket.data.userId = user._id.toString();
    socket.data.role = user.role;
    return next();
  } catch {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', socket => {
  const userId = socket.data.userId as string;
  const role = socket.data.role as string;
  const isAdmin = role === 'admin';
  const ownRoom = isAdmin ? ADMIN_ROOM : userId;

  socket.join(ownRoom);
  console.log(`User ${userId} connected to room ${ownRoom} with socket ID: ${socket.id}`);

  socket.on('send_message', async (data: SendChatMessageDto) => {
    try {
      const content = data.content?.trim();
      if (!content) throw new Error('Message content is required');

      let conversationId = userId;
      let senderId = userId;
      let receiverId = ADMIN_ROOM;

      if (isAdmin) {
        if (!data.conversationId || !Types.ObjectId.isValid(data.conversationId)) {
          throw new Error('A valid buyer conversation is required');
        }

        const recipient = await User.findById(data.conversationId).select('_id role');
        if (!recipient || recipient.role === 'admin') {
          throw new Error('Admin cannot start a conversation with an admin account');
        }

        conversationId = recipient._id.toString();
        senderId = ADMIN_ROOM;
        receiverId = conversationId;
      }

      const payload: SendMessageDto = {
        conversationId,
        senderId,
        receiverId,
        content,
      };

      const messageData = await sendMessageService(payload);
      await createOrUpdateConversationService(
        {
          lastMessage: content,
        },
        conversationId
      );

      io.to(receiverId).emit('receive_message', messageData);

      // Keep other open admin tabs in sync when an admin replies.
      if (isAdmin) socket.to(ADMIN_ROOM).emit('receive_message', messageData);

      socket.emit('message_sent', messageData);
    } catch (error) {
      console.error('Send message error:', error);
      console.log(error);
      socket.emit('message_error', {
        message: 'Send message failed',
      });
    }
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
