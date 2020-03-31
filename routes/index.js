const express = require('express');
const { isLogin, isNotLogin } = require('./middlewares');

const router = express.Router();

router.get('/', (req, res, next) =>{
  res.render('index');
});

router.get('/room', isLogin, (req, res, next) =>{
  res.render('room');
});
module.exports = router;
