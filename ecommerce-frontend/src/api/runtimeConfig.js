const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

export const API_URL = trimTrailingSlashes(
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000/api",
);

// Socket.IO and the REST API are served by the same backend. Deriving this URL
// prevents an old VITE_SOCKET_URL deployment setting from sending chat traffic
// to a different server or port.
export const SOCKET_URL = API_URL.replace(/\/api$/, "");
