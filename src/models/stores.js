const mongoose = require('mongoose');
const {Schema} = mongoose;

const Stores = new Schema({
    title: String,
    type: {type: [String]},
    location: {
        address : String,
        latitude : Number, 
        longitude : Number 
    },
    time : String,
    items : [], ///....?
    description : String
})

module.exports = mongoose.model('Stores', Stores);