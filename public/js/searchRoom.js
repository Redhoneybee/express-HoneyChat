
const ALLROOM = "allRoom"
      MYROOM = "myRoom";


function paintToRoomList(json, paintFlag){
  let ul = $('.js-rooms');
  if(paintFlag === MYROOM){
    ul = $('.js-myRooms');
  }
  let count = 0;
  json.rooms.forEach(function(room){
    let query = `<li id = ${room._id}><a href="/room/${room._id}">${room.title}</a><small>(${json.person[count]}/${room.max})</small></li>`;
    if(paintFlag === MYROOM){
      query = `<li id = ${room._id}><a href="/room/${room._id}">${room.title}</a><small>(${json.person[count]}/${room.max})</small><button>DELETE</button></li>`;
    }
    ul.append(query);
    $(`#${room._id} button`).click(function(event){
      event.preventDefault();
      const li = event.target.parentNode;
      console.log(li.nodeName);

      $.ajax({
        url : `http://localhost:3000/room/${room._id}`,
        method : 'DELETE'
      })
      .done(() => {
        li.remove();
        alert('Successed to delete room');
      })
      .fail((xhr, status, errorToken) => { console.log(status, errorToken) })
      .always((xhr, status) => {});
    });
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
