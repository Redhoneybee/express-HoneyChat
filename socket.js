
const socketIO = require('socket.io');
const axios = require('axios');

const INC_MAX = 'incrementMax'
      ,DEC_MAX = 'decrementMax';

function changeMax(socket, room, roomId, flag){
  room.emit(flag, {
    room : roomId,
    max : socket.adapter.rooms[roomId].length,
  });
}
module.exports = (server, app, middleSession) =>{
  const io = socketIO(server, {
    path : '/socket.io'
  });
  app.set('io', io);

  const room = io.of('/room');
  const chat = io.of('/chat');
  io.use((socket, next) =>{
    middleSession(socket.request, socket.request.res, next);
  });
  room.on('connection', (socket) =>{
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log('Connect the room namespace', ip);

    socket.on('disconnect', () =>{
      console.log('Disconnected the room namespace', ip);
    });
  });

  chat.on('connection', async (socket) =>{
    const req = socket.request;

    console.log('connect the chat namespace');

    // room number
    const { headers : { referer } } = req;
    const roomId = referer
        .split('/')[referer.split('/').length - 1]
        .replace(/\?.+/, '');
    socket.join(roomId);

    if(req.session.passport !== undefined){
      socket.to(roomId).emit('join', {
        system : 'system',
        user : req.session.passport.user,
        message : `"${req.session.passport.user}" is here`
      });
      // increment max
      changeMax(socket, room, roomId, INC_MAX);
      if(socket.adapter.rooms[roomId].length === 1){
        socket.adapter.rooms[roomId].username = [];
      }
      socket.adapter.rooms[roomId].username.push(req.session.passport.user);
    }
    // disconnect
    socket.on('disconnect', () =>{
      socket.leave(roomId);
      console.log('Disconnected the chat namespace');
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if(userCount === 0){
        axios.delete(`http://localhost:3000/room/${roomId}`)
          .then(() =>{
            console.log('Deleted room');
          })
          .catch((error) =>{
            console.error(error);
          });
      }else{
        socket.to(roomId).emit('exit', {
          system : 'system',
          user : req.session.passport.user,
          message : `"${req.session.passport.user}" is exit`
        });
        changeMax(socket, room, roomId, DEC_MAX);
      }
    });
  });
};
