
const socketIO = require('socket.io');

module.exports = (server, app, middleSession) =>{
  const io = socketIO(server, {
    path : '/socket.io'
  });
  app.set('io', io);

  const room = io.of('/room');
  const chat = io.of('/chat');

  room.on('connection', (socket) =>{
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log('Connect the room namespace', ip);

    socket.on('disconnect', () =>{
      console.log('Disconnected the room namespace', ip);
    });
  });

  chat.on('connection', (socket) =>{
    const req = socket.request;

    console.log('connect the chat namespace');

    // room number
    const { headers : { referer } } = req;
    const roomId = referer
        .split('/')[referer.split('/').length - 1]
        .replace(/\?.+/, '');
    socket.join(roomId);

    socket.on('disconnect', () =>{
      socket.leave(roomId);
      console.log('Disconnected the chat namespace');
    });
  });
};
