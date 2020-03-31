
const mongoose = require('mongoose');

const { NODE_ENV } = process.env;
const MONGO_URL = 'mongodb://localhost:27017/admin';

module.exports = () =>{
  const connect = () =>{
    if(NODE_ENV !== 'production'){
      mongoose.set('debug', true);
    }

    mongoose.connect(MONGO_URL, {
      dbName : 'HoneyChat'
    }, (error) =>{
      if(error){
        console.error('Mongo database error', error);
      }else{
        console.log('Successed to Connect Mongo Database');
      }
    });
  };

  connect();

  mongoose.connection.on('error', (error) =>{
    console.error(error);
  });
  mongoose.connection.on('disconnected', () =>{
    console.log('Disconnected to Mongo Database, starts reconnecting...5sec');
    setInterval(connect, 5000);
  });

  require('./user');
  require('./room');
  require('./chat');
};
