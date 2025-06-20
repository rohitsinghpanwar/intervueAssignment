import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { socketHandlers } from './socket.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://intervue-assignment-iota.vercel.app'
  }
});

app.use(cors());

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Polling App Backend</title>
        <style>
          body {
            background: #f4f4f4;
            font-family: sans-serif;
            text-align: center;
            padding-top: 50px;
          }
          h1 {
            color: #8F64E1;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1>🎉 Polling App Backend is Running!</h1>
        <p>Socket.IO server active and awaiting connections...</p>
      </body>
    </html>
  `);
});

socketHandlers(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
