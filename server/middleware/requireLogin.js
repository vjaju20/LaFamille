const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");
module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    //authorization === Bearer token
    if(!authorization){       //if authorization header is not present
        return res.status(401).json({error:"You must be logged in!"})
        //401 -> Unauthorized
    }
    const token = authorization.replace("Bearer ",""); //replacing the "Bearer " to get the given token
    /* jwt.verfiy verifies if the recieved token is same as the JWT_SECRET code */
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must be logged in!"})
        }
        const {_id} = payload;
        User.findById(_id).then(userdata=>{
            req.user = userdata;
            next(); //to stop the middleware and continue the code or move to the next middleware
        })
        /* We put the next() funtion inside the findById so that the code will move to next lines or
        middleware after the completion of the line above next() otherwise it will give req.user value
        undefined if some other function calls it during the process as the findById take a while */
    })
}