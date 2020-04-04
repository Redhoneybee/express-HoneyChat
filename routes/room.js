const express = require('express');

const User = require('../schemas/user');
const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const bcrypt = require('bcrypt');

const { isLogin, isNotLogin } = require('./middlewares');
const router = express.Router();

router.post('/create', isLogin, async (req, res , next) =>{
  try{
    const { title, max, password } = req.body;
    const extRoom = await Room.findOne( { title : title } );
    if(extRoom){
      // Already title name
      return res.redirect('/room');
    }
    let passwordUse = false;
    let hash = '';
    if(password !== undefined){
      // password is able
      passwordUse = true;
      hash = await bcrypt.hash(password, 16);
    }
    const newRoom = new Room({
      title,
      max,
      owner : req.user._id,
      passwordUse,
      password : hash
    });
    await newRoom.save();

    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  }catch(error){
    console.error(error);
    next(error);
  }

});

router.get('/:id', async (req, res , next) =>{
  try{
    const room = await Room.findOne( { _id : req.params.id } );
    const io = req.app.get('io');

    if(!room){
      // Room is not...
      req.flash('Not found Room');
      return res.redirect('/room');
    }
    if(room._doc.passwordUse){
      // use room password
      const result = await bcrypt.compare(req.query.password, room._doc.password);

      if(!result){
        // No matched password
        req.flash('No matched password');
        return rss.redirect('/room');
      }
    }
    // room password not
    const { rooms }  = io.of('/chat').adapter;
    if(rooms && rooms[req.query.id] && room.max <= rooms[req.query.id].length){
      req.flash('Overage of max person');
      return res.redirect('/room');
    }
    return res.render('chat', {
      room : room._doc._id,
      title : room._doc.title,
      chats : [],
      user : req.user.username
    });
  }catch(error){
    console.error(error);
    return next(error);
  }
});

router.post('/:id/chat', async (req, res, next) =>{
  try{
    const chat = new Chat({
      room : req.params.id,
      user : req.user._id,
      chat : req.body.chat
    });
    await chat.save();
    const user = await User.findOne({ _id : req.user._id });
    const sendChatData = {
      room : req.params.id,
      user : user.username,
      chat : req.body.chat
    }
    const io = req.app.get('io');
    io.of('/chat').to(req.params.id).emit('chat', sendChatData);
    const okToken = { ok : 'ok'};
    res.json(okToken);
  }catch(error){
    console.error(error);
    next(error);
  };
});

router.post('/:id/userList', (req, res, next) =>{
  console.log('userList');
  try{
    console.dir(req);
    const reqUsers = req.body.data;
    let users = [];
    console.dir(reqUsers);
    if(reqUsers !== undefined){

      reqUsers.Foreach(async (user) =>{
        console.log('userList : ',user);
        const result = await User.findOne( { id : user });

        if(result._doc._id !== req.user._id){
          users.push(result._doc.username);
        }
      });

      const list = {
        users
      }

      io.of('/room').to(req.params.id).emit('userList', list);
    }
  }catch(error){
    next(error);
  }
});
router.delete('/:id', async (req, res, next) =>{
  try{
    await Room.remove( { _id : req.params.id } );
    await Chat.remove( { room : req.params.id } );
    res.send('ok');
    setTimeout(() =>{
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  }catch(error){
    console.error(error);
    next(error);
  }
});
router.post('/roomAll', isLogin, async (req, res, next) =>{
  // room list json
  await Room.find({}, {
    password : 0,
    owner : 0
    })
    .then((rooms) =>{
      res.json(rooms);
    })
    .catch((error) =>{
      console.error(error);
      res.next(error);
    });
});
router.post('/myRoom', isLogin, async (req, res, next) =>{
  // My room list json
  await Room.find({ owner : req.user._id }, {
    password : 0,
    owner : 0
  })
  .then((rooms) =>{
    res.json(rooms);
  })
  .catch((error) =>{
    console.error(error);
    res.next(error);
  });
});
module.exports = router;
