function socketNewRoom(socket){
  socket.on('newRoom', (data) => {
    if(data instanceof Array) console.log('Array');
    else{ console.log('Object'); }
    const ul = $('.js-rooms');

    ul.append(`<li><a href="/room/${data._id}">${data.title}</a><small>(1/10)</small></li>`);
  });
}

function roomSocketInit(){
  const socket = io.connect('http://localhost:3000/room', {
    path : '/socket.io'
  });
  socketNewRoom(socket);
}
