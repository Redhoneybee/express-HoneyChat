const express = require('express');

const User = require('../schemas/user');
const Room = require('../schemas/room');

const bcrypt = require('bcrypt');

const { isLogin, isNotLogin } = require('./middlewares');
const router = express.Router();

router.post('/create', isLogin, async (req, res , next) =>{
  try{
    const { title, max, password } = req.body;
    const extRoom = Room.findOne( { title } );
    if(extRoom){
      // Already title name
      return res.redirect('/room');
    }
    let passwordUse = false;
    let hash = password;
    if(password !== ''){
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
    io.of('/room').emit('newROom', newRoom);
    res.redirect(`/${newRoom._id}?password=${req.body.password}`);
  }catch(error){
    console.error(error);
    next(error);
  }

});

router.post('/roomAll', isLogin, async (req, res, next) =>{
  await Room.find({}, {password : 0})
    .then((rooms) =>{
      res.json(rooms);
    })
    .catch((error) =>{
      console.error(error);
      res.next(error);
    });
});
module.exports = router;
