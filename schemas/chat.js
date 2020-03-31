
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types : { ObjectId }} = Schema;
const chatSchema = new Schema({
  room : {
    type : ObjectId,
    required : true,
    ref : 'rooms'
  },
  user : {
    type : ObjectId,
    required : true,
    ref : 'users'
  },
  chat : String,
  gif : String,
  createdAt : {
    type : Date,
    default : Date.now
  }
});
module.exports = mongoose.model('chats', chatSchema);
