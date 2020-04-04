
const ALLROOM = "allRoom"
      MYROOM = "myRoom";

function paintToRoomList(json, paintFlag){
  let ul = $('.js-rooms');
  if(paintFlag === MYROOM){
    ul = $('.js-myRooms');
  }
  json.forEach(function(room){
    const query = `<li><a href="/room/${room._id}">${room.title}</a><small>(1/10)</small></li>`
    ul.append(query);
  });
}

function allOfTheRoomList(){
  $.ajax({
    url : 'http://localhost:3000/room/roomAll',
    method : 'POST',
    dataType : 'json'
  })
  .done((json) =>{
    paintToRoomList(json, ALLROOM);
  })
  .fail((xhr, status, errorToken) => {})
  .always((xhr, status) => {});
}

function myRoomList(){
  $.ajax({
    url : 'http://localhost:3000/room/myRoom',
    method : 'POST',
    dataType : 'json'
  })
  .done((json) => {
    paintToRoomList(json, MYROOM);
  })
  .fail((xhr , status, errorToken) => {})
  .always((xhr, status) => {});
}
async function searchRoomInit(){
  await allOfTheRoomList();
  await myRoomList();
}
