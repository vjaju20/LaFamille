const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    resetToken : String,
    expireToken : Date,
    pic : {
        type : String,
        default : "https://res.cloudinary.com/varun20/image/upload/v1631803032/no_avatar_kfir3e.jpg"
    },
    followers:[{
        type : ObjectId,
        ref : "User"
    }],
    following:[{
        type : ObjectId,
        ref : "User"
    }],
})
mongoose.model("User",userSchema); //we have to register our model in our app.js
//module.exports = mongoose.model("User",userSchema); 
//We didn't use the above commented approach to register our model as sometimes it gives error that you
//have used this model at one place, so you can't use it at other places/files now