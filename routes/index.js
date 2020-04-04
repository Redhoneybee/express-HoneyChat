const express = require('express');
const { isLogin, isNotLogin } = require('./middlewares');

const router = express.Router();

router.get('/', (req, res, next) =>{
  res.render('index');
});

router.get('/room', isLogin, (req, res, next) =>{
  res.render('room', {
    user : req.user.username
  });
});

router.post('/mine', isLogin, (req, res, next) =>{
  const json = { user : req.user.username };
  res.json(json);
});
module.exports = router;
