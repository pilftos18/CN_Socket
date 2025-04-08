import express from 'express';
import {Server} from 'socket.io';
import cors from 'cors';
import http from 'http';

const app = express();
// 1. Create Server Using  http.
const server = http.createServer(app);

// 2.create socket server
const io = new Server(server,{
    cors:{
        origin: '*',
        method: ['GET','POST'],
    }
})

// 3.Use Socket Events.

io.on('connection',(socket)=>{
    console.log('Connection is established');

    socket.on('disconnect',()=>{
        console.log('Connection is Disconnected');
    })
})

server.listen(3000, ()=>{
    console.log('Server listening on 3000');
})