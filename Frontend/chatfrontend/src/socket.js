import { io } from "socket.io-client";


export const socket =io(import.meta.env.MODE =="development"?"http://localhost:5000":import.meta.env.VITE_API_URL, {
  autoConnect: false,
  withCredentials: true,
});

