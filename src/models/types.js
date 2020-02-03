const mongoose = require('mongoose');
const {Schema} = mongoose;

const Types = new Schema({
    name: String,
    number: Number,
})

module.exports = mongoose.model('Types', Types);