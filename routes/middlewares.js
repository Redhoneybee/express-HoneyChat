

exports.isLogin = (req, res, next) =>{
  if(req.isAuthenticated()){
    next();
  }else{
    res.status(403).send('please Login');
  }
};

exports.isNotLogin = (req, res, next) =>{
  if(!req.isAuthenticated()){
    next();
  }else{
    res.redirect('/');
  }
};
