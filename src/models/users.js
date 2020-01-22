const mongoose = require('mongoose');
const { Schema } = mongoose;

const Users = new Schema({
  id : String,
  password : String,
  name : String,
  likes : [Schema.Types.ObjectId],
  stores : [Schema.Types.ObjectId]  
})

module.exports = mongoose.model('Users', Users);