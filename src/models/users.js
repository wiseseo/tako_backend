const mongoose = require('mongoose');
const { Schema } = mongoose;

const Users = new Schema({
  id : String,
  password : String,
  name : String,
  likes : {type: [Schema.Types.ObjectId], default:[]},
  stores : {type: [Schema.Types.ObjectId], default:[]}  
})

module.exports = mongoose.model('Users', Users);