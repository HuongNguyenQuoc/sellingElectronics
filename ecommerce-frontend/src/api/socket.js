import { io } from "socket.io-client";

import { SOCKET_URL } from "./runtimeConfig";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  // A Render free instance can take around 50 seconds to wake up.
  timeout: 65_000,
  reconnection: true,
  reconnectionAttempts: Infinity,
});

let connectedToken = null;

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    socket.disconnect();
    return false;
  }

  // Re-authenticate if another account logged in while this module remained
  // mounted (for example after switching between buyer and admin sessions).
  if (socket.connected && connectedToken !== token) socket.disconnect();

  connectedToken = token;
  socket.auth = { token };
  if (!socket.connected) socket.connect();
  return true;
};

export default socket;
