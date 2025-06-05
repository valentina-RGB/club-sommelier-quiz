import { io } from 'socket.io-client';

export const participantSocket = io(import.meta.env.VITE_API_BASE_URL, {
  autoConnect: false,
  transports: ['websocket']
});

export const adminSocket = io(import.meta.env.VITE_API_BASE_URL, {
  autoConnect: false,
  transports: ['websocket']
});