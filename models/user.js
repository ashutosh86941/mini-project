const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const userSchema = mongoose.Schema({
    age : Number,
    name : String,
    email : String,
    username : String,
    password : String
})

module.exports = mongoose.model('user' , userSchema);
