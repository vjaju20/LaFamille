const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");
router.get('/user/:userid',requireLogin,(req,res)=>{
    /* as we are getting all the details of the user from userid but we don't want to send password of the
    user to our frontend so we use .select("-password"),we'll get all the details except for password */
    User.findOne({_id:req.params.userid}).select("-password").then(user=>{
        /* now as we have all the details of the user from userid except for password, so we are finding the
        posts posted by the user and show them with only id and name */
        Post.find({postedBy:req.params.userid}).populate("postedBy","_id name").exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err});
            }
            res.json({user,posts});
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})
router.put('/follow',requireLogin,(req,res)=>{
    /* here the followId is the id the user whom the current user wants to follow and we recieve it from our
    frontend and _id is the current logged in user, so first we are updating the followers and then update
    the followings of the current user */
    User.findByIdAndUpdate(req.body.followId,{
        $push : {followers:req.user._id}   
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push : {following:req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        })
    })
})
router.put('/unfollow',requireLogin,(req,res)=>{
    /* here the unfollowId is the id the user whom the current user wants to unfollow and we recieve it from our
    frontend and _id is the current logged in user, so first we are updating the followers and then update
    the followings of the current user */
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull : {followers:req.user._id}   
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull : {following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        })
    })
})
router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:"Pic can't be posted!"})
        }
        res.json(result)
    })
    /* {$set:{pic:req.body.pic}} this piece of code will update our pic on the server side */
})
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.username);
    User.find({name:{$regex:userPattern}}).select("_id name").then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router    //we need to register this router in our app.js of server side
/* we have created this router to see the posts of the other users or the friends linked with our account */