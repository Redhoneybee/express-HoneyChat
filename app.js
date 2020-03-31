const express = require('express')
      ,path = require('path')
      ,cookieParser = require('cookie-parser')
      ,expressSession = require('express-session')
      ,passport = require('passport');

const morgan = require('morgan');
require('dotenv').config();

const connect = require('./schemas');
const indexRouter = require('./routes');
const authRouter = require('./routes/auth')


const app = express();
const webSocket = require('./socket');
connect();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({sxtended : false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const middleSession = expressSession({
  secret : process.env.COOKIE_SECRET,
  resave : false,
  saveUninitialized : false,
  cookie : {
    httpOnly : true,
    secure : false
  }
});
app.use(middleSession);
const flash = require('connect-flash');
app.use(flash());

const passportCofing = require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/auth', authRouter);

// page error (next)
app.use('/', (req, res, next) =>{
  const erorr = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use('/', (err, req, res, next) =>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () =>{
  console.log(`Started to HoneyChat Server...${app.get('port')}`);
});

webSocket(server, app, middleSession);
