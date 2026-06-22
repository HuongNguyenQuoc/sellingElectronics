import { io } from "socket.io-client";

import { SOCKET_URL } from "./runtimeConfig";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    socket.disconnect();
    return false;
  }

  socket.auth = { token };
  if (!socket.connected) socket.connect();
  return true;
};

export default socket;
