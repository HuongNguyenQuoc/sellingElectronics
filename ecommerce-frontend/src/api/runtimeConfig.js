const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

export const API_URL = trimTrailingSlashes(
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000/api",
);

// Socket.IO is served by the same Render service as the REST API. VITE_SOCKET_URL
// remains available as an override, but normally VITE_API_URL is all we need.
export const SOCKET_URL = trimTrailingSlashes(
  import.meta.env.VITE_SOCKET_URL?.trim() || API_URL.replace(/\/api$/, ""),
);
