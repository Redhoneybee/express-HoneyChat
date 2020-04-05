const INC_MAX = 'incrementMax'
      ,DEC_MAX = 'decrementMax';

function paintToMax(room, max){
  const small = $(`#${room} small`);
  let smallVal = small.text();
  const s = smallVal.indexOf('/');
  const b = smallVal.indexOf(')');
  small.text(`(${max}${smallVal.slice(s, b-s+2)})`);
}
function socketIncDecMax(socket){
  // inc
  socket.on(INC_MAX, (data) =>{
    paintToMax(data.room, data.max);
  });
  // dec
  socket.on(DEC_MAX, (data) =>{
    paintToMax(data.room, data.max);
  });
}
function socketRemoveRoom(socket){
  socket.on('removeRoom', (data) =>{
    console.log(data);
    const li = $(`.js-rooms .${data}`);
    li.remove();
  });
}
function socketNewRoom(socket){
  socket.on('newRoom', (data) => {
    const ul = $('.js-rooms');

    ul.append(`<li id = ${data._id}><a href="/room/${data._id}">${data.title}</a><small>(1/${data.max})</small></li>`);
  });
}

function roomSocketInit(){
  const socket = io.connect('http://localhost:3000/room', {
    path : '/socket.io'
  });
  socketNewRoom(socket);
  socketRemoveRoom(socket);
  socketIncDecMax(socket);
}
