const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:"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"
    }
}))
router.get('/allpost',requireLogin,(req,res)=>{
    /* find() method return all the posts stored in the database and by using populate() method
    will help us to get all the details of the postedBy and the second argument of the populate() method
    hepls us to get only the fields which we want */
    Post.find().populate("postedBy","_id name pic").populate("comments.postedBy","_id name").sort("-createdAt").then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err);
    })
})
router.get('/getflwgspost',requireLogin,(req,res)=>{
    /* by calling this route we'll able to see all the posts of the people we're following */
    /* Post.find({postedBy:{$in:req.user.following}}) what this line is doing is checking if the user postedBy
    is present in the following array */
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic").populate("comments.postedBy","_id name").sort("-createdAt").then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err);
    })
})
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please fill all the fields!"})
    }
    req.user.password = undefined; 
    //We have set the password to undefined so that database don't store password for the post
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy : req.user
    })
    post.save().then(result=>{
        res.json({post:result});
    })
    .catch(err=>{
        console.log(err);
    })
})
router.get('/mypost',requireLogin,(req,res)=>{
    /* We will get only the posts of the user requesting it */
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name").sort("-createdAt").then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err);
    })
})
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
        /* we need to write the above line otherwise mongodb give us the old record but we want the updated
        one */
    }).populate("postedBy","name pic").populate("comments.postedBy","name").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        else{
            res.json(result);
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
        /* we need to write the above line otherwise mongodb give us the old record but we want the updated
        one */
    }).populate("postedBy","name pic").populate("comments.postedBy","name").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        else{
            res.json(result);
        }
    })
})
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
        /* we need to write the above line otherwise mongodb give us the old record but we want the updated
        one */
    }).populate("comments.postedBy","_id name"/* we are populating the postedBy because we want the name of
    the user who posted it and not just the id */).populate("postedBy","_id name pic").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        else{
            res.json(result);
        }
    })
})
/* to delete a post the user also need to send the postId in the url which need to be deleted and for this we
need to pass the parameter using /:postId */
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId}).populate("postedBy","_id").exec((err,post)=>{
        if(err || !post){
            /* checking if err is present or the post is not present */
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            /* we use the toString() method to convert the id's to strings as both are of type ObjectId
            and comparing them will always give false and this if is doing is it is checking if the current
            user is equal to the user who has created the post as only the user who has created the post
            can delete it */
            post.remove().then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})
router.delete('/deleteacc/:accid',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.accid}).exec((err,acc)=>{
        if(err || !acc){
            /* checking if err is present or the post is not present */
            return res.status(422).json({error:err})
        }
        if(acc._id.toString() === req.user._id.toString()){
            /* we use the toString() method to convert the id's to strings as both are of type ObjectId
            and comparing them will always give false and this if is doing is it is checking if the current
            user is equal to the user who has created the post as only the user who has created the post
            can delete it */
            Post.deleteMany({postedBy:req.user._id}).then(()=>{
                console.log("Posts deleted!")
            })
            acc.remove().then(result=>{
                transporter.sendMail({
                    to: acc.email,
                    from: "varunjaju677@gmail.com",
                    subject: "Account Deleted",
                    html: `
                        <p>Your account has been deleted from LaFamille.</p>
                        <img width="150px" height="150px" src="https://res.cloudinary.com/varun20/image/upload/v1632761415/Account_Deleted_j6up2h.png" alt="Account Deleted"/>
                    `
                })
                res.json({message:"Account Deleted,Check your mail"})
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})
module.exports = router; //register the router in app.js
/* in the like and unlike route we can use post instead of put and it will work as well but put is a better
option in cases where we want to update something and in the like and unlike routes we had to add
.populate("postedBy","name").populate("comments.postedBy","name") otherwise on liking and unliking a post the
name of the user who posted that post and the name of the users who commented on that post will be removed
and this line is written on the basis of ouput of console.log(result) in the Home.js /allpost */
/* sort("-createdAt") what this will do is as we have added timestamps in models post.js so it provided sort
method so that latest posts comes on top and - is for descending order(means latest from oldest) */