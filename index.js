const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 4000;
const NEW_BUZZ_EVENT = 'new_buzz_event';
const NEW_USER_EVENT = 'new_user_event';

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  const { roomCode } = socket.handshake.query;
  socket.join(roomCode);

  socket.on(NEW_BUZZ_EVENT, (data) => {
    io.in(roomCode).emit(NEW_BUZZ_EVENT, data);
  });

  socket.on(NEW_USER_EVENT, (data) => {
    io.in(roomCode).emit(NEW_USER_EVENT, data);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomCode);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
