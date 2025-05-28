import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  path: '/socket.io',
  transports: ['websocket'],
});

export default socket;