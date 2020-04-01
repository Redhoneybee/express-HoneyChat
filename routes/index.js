const express = require('express');
const { isLogin, isNotLogin } = require('./middlewares');

const router = express.Router();

router.get('/', (req, res, next) =>{
  res.render('index');
});

router.get('/room', isLogin, async (req, res, next) =>{
  res.render('room', {
    user : req.user.username
  });
});

module.exports = router;
