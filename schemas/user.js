

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  id : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  username : {
    type : String,
    required : true,
    unique : true
  },
  createdAt : {
    type : Date,
    default : Date.now
  },
  updatedAt : {
    type : Date,
    default : Date.now
  }
});

module.exports = mongoose.model('users', userSchema);
