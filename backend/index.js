import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { socketHandlers } from './socket.js'

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*'
    }
})
app.use(cors)
socketHandlers(io)
const PORT=3000
server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})