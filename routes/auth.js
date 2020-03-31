const express = require('express');
const passport = require('passport');
const { isLogin, isNotLogin } = require('./middlewares');
const bcrypt = require('bcrypt');
const User = require('../schemas/user');

const router = express.Router();

router.post('/login', isNotLogin, (req, res, next) =>{
  passport.authenticate('local', (err, user, info) =>{
    if(err){
      console.error(err);
      return next(err);
    }

    if(!user){
      req.flash('loginError', info.message);
      return res.redirect('/');
    }

    return req.login(user, (loginError) =>{
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/room');
    });
  })(req, res, next);
});

router.post('/join', isNotLogin, async (req, res, next) =>{
  const { id, password, username } = req.body;

  try{
    const exId = await User.findOne( { id } );
    if(exId){
      req.flash('joinError', 'aleardy account');
      return res.redirect('/');
    }

    const hashPassword = await bcrypt.hash(password, 16);
    const newUser = new User({
      id,
      password : hashPassword,
      username
    });
    await newUser.save();

    return res.redirect('/');
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/logout', isLogin, (req, res, next) =>{
  req.logout();
  req.session.distroy();
  res.redirect('/');
});


module.exports = router
