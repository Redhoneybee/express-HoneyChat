let mine;

const MINE_CHAT = "mine"
      ,YOUR_CHAT = "your";

function paintToChat(user, chat, chatFlag){
  const chatsDiv = $('.js-chats');

  const query =
    `<li class = "message-box"><div id = ${chatFlag}><p class = "username">${user}</p><div class = "message">${chat}</div></div></li>`;

  chatsDiv.append(query);
}

function paintToSystemMessage(system, systemMessage){
  const systemBar = $('.js-system-bar');  const systemH4 = $('.js-system');
  const systemSmall = $('.js-system-message');

  systemH4.text(system);
  systemSmall.text(systemMessage);

  systemBar.slideDown('slow');
  setTimeout(() =>{
    systemBar.slideUp('slow');
  }, 3000);
}

function socketUserList(socket){
  socket.on('userList', function(data){
    data.users.Foreach((user) =>{
      const users = $('.users');
      const query = `<li id = ${user}><a href = "#">${user}</a></li>`;
      users.append(query);
    })
  });
}
function socketUserChat(socket){
  socket.on('chat', function(data) {
    if(data.user === mine){
      // mine chat
      paintToChat(data.user, data.chat, MINE_CHAT);
    }else{
      // your chat
      paintToChat(data.user, data.chat, YOUR_CHAT);
    }

  });
}

function socketUserExit(socket){
  socket.on('exit', function(data){
    $('li').remove(`#${data.user}`);
    paintToSystemMessage(data.system, data.message);
  });
}
function socketUserJoin(socket){
  socket.on('join', function(data){
    const users = $('.users');
    const query = `<li id = ${data.user}><a href = "#">${data.user}</a></li>`;
    users.append(query);
    paintToSystemMessage(data.system, data.message);
  });
}

function chatSocketInit(){
  const socket = io.connect('http://localhost:3000/chat', {
    path : '/socket.io'
  });

  $.ajax({
    url : 'http://localhost:3000/mine',
    method : 'POST',
    dataType : 'json'
  })
  .done((json) =>{
    mine = json.user;
  })
  .fail((xhr, status, errorToken) =>{
    console.log(status, errorToken);
  }).always((xhr, status) => {});

  // socket
  socketUserJoin(socket);
  socketUserList(socket);
  socketUserChat(socket);
  socketUserExit(socket);
}
