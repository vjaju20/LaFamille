//We are creating a schema for our posts in this file
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;      //setting up the relation between our post and user schema
const postSchema = new mongoose.Schema({       //structure of the post
    title:{
        type : String,
        required : true
    },
    body:{
        type : String,
        required : true
    },
    photo:{
        type : String,
        required : true
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text : String,
        postedBy : {type:ObjectId,ref:"User"}
    }],
    postedBy:{
        type : ObjectId,
        ref : "User"          //reference to our user schema
    }
},{timestamps:true})
mongoose.model("Post",postSchema);     //we need to register our model in the app.js