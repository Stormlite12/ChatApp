import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import Message from './db/message.js';
import 'dotenv/config'


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});


const URL = process.env.DATABASE_URL;
mongoose.connect(URL)
    .then(() => console.log("Database connected successfully."))
    .catch(e => console.error('Database connection error:', e));


io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('sendMessage', async (data) => {
        try {
            const message = new Message({
                text: data.text,
                name: data.name
            });
            const savedMessage = await message.save();

            io.emit('newMessage', savedMessage);
        } catch (e) {
            console.error('Error handling message:', e.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

