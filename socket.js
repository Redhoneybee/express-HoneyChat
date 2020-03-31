
const socketIO = require('socket.io');

module.exports = (server, app, middleSession) =>{
  const io = socketIO(server, {
    path : '/socket.io'
  });


};
