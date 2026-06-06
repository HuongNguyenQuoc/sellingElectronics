import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New client connected\n Server running on port 8080");

    ws.on("message",  (message) => {
    console.log(`Received message: ${message}`);
    // Broadcast the message to all connected clients
    ws.send(`Nhận tin nhắn: ${message}`);
    });
});