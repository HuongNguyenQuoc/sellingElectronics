import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { SendMessageDto } from '../dtos_data-transfer-object/message.dto';
import { sendMessageService } from '../services/message.service';

const server = http.createServer();

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
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

  socket.on('send_message', async (data: SendMessageDto) => {
      try{
        const messageData = await sendMessageService(data)
        // Emit the message to the receiver's room
        io.to(data.receiverId).emit('receive_message',messageData);
        socket.emit('message_sent',messageData);
      }catch(error){
        socket.emit('message_error',{
          message:'Send message failed'
        });
      }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

});

server.listen(3000, () => {
  console.log('Socket.IO server is running on port 8080');
});