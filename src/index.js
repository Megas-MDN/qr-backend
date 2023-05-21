const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const router = require('./routes');
const dbConn = require('./models/dbConn');
const { handlerInventory } = require('./services/productsService');

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const port = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('Conectado %s', socket.id);

  socket.on('message-qr-product', (payload) => {
    socket.broadcast.emit(`message-${payload.idDestination}`, payload);
  });

  socket.on('disconnect', (reason) => {
    console.log('Desconectado %s', socket.id, reason);
  });

  socket.on('answer-checkout', (payload) => {
    const url = `answer-checkout-${payload.hostRequest}`;
    if (payload.answer === 'accept') {
      const transferTo = {
        origin: payload.host,
        destination: payload.hostRequest,
        prodId: payload.prodId,
      };

      handlerInventory(transferTo).then(({ status }) => {
        if (status === 200) {
          socket.broadcast.emit(`re-fetch-${payload.hostRequest}`);
          socket.emit(`re-fetch-${payload.host}`);
        }
      });
    }
    socket.broadcast.emit(url, payload);
  });

  socket.on('request-checkin', (payload) => {
    socket.broadcast.emit(
      `request-checkin-${payload.hostDestination}`,
      payload
    );
  });

  socket.on('answer-checkin', (payload) => {
    const url = `answer-checkin-${payload.hostRequest}`;

    if (payload.answer === 'accept') {
      const transferTo = {
        origin: payload.hostRequest,
        destination: payload.host,
        prodId: payload.prodId,
      };

      handlerInventory(transferTo).then(({ status }) => {
        if (status === 200) {
          socket.broadcast.emit(`re-fetch-${payload.hostRequest}`);
          socket.emit(`re-fetch-${payload.host}`);
        }
      });
    }
    socket.broadcast.emit(url, payload);
  });
});

dbConn().then(() =>
  httpServer.listen(port, () => console.log('Server Up na porta %s', port))
);
