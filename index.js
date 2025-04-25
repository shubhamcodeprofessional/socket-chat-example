import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve the index.html
app.use(express.static(join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'static/index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Send broadcast to all *other* clients when a user connects
    socket.broadcast.emit('chat message', 'A new user has joined the chat');

    // Listen to 'chat message' from this socket
    socket.on('chat message', (msg) => {
        console.log('message:', msg);
        io.emit('chat message', msg); // Broadcast to all including sender
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});
