const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL} = require('../config/keys')
//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  <-- My Email API
/*const requireLogin = require('../middleware/requireLogin');
router.get('/protected',requireLogin,(req,res)=>{
    //requireLogin is a middleware which is checking if the user is an authorized one 
    res.send("hello user");
})*/
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:SENDGRID_API
    }
}))
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email || !password || !name){
        return res.status(422).json({error:"Please add all the fields"})
        //set the error code 422 otherwise it will show 200 which comes on successful execution
        //we want to send error as user has missed some entity/entities
        //this will show that the request has been proccessed but can't be executed due to error
    }
    User.findOne({email:email}).then((savedUser)=>{     //checking if the user is existing or new
        if(savedUser){                                  //to check if the user is already exists
            return res.status(422).json({error:"User already exists with that email"});
        }
        /*we installed and used the bcryptjs to convert the user typed password into hashed password
        we store the converted password in our database as if someone hacked our database the hacker
        don't get into our users accounts using their passwords*/
        /*If we don't use bcryptjs the originally typed user passwords will be stored in our database and
        storing original passwords is a sin*/
        bcrypt.hash(password,12).then(hashedpassword=>{
            const user = new User({
                email,
                password : hashedpassword,
                name,
                pic
            })
            user.save().then(user=>{                         //to save the user
                transporter.sendMail({
                    to: user.email,
                    from: "varunjaju677@gmail.com",
                    subject: "Account created",
                    html: "<h3>Welcome to LaFamille!!!</h3><p>Your account has been successfully created.</p><p>Happy exploring!</p><br/><img width='150px' height='150px' src='https://res.cloudinary.com/varun20/image/upload/v1632822943/startexploring_acovbh.jpg' alt='start exploring'/>"
                })
                res.json({message:"Account Created,check your Mail"})
            }).catch(err=>{
                console.log(err);
                /* We are putting this error in console as this error is produced from developer(our) end not the user end */
            })
        })
    }).catch(err=>{
        console.log(err);
        /* We are putting this error in console as this error is produced from developer(our) end not the user end */
    })
})
router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(422).json({error:"Please provide all the details"})
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password!"})
        }
        bcrypt.compare(password,savedUser.password).then(doMatch=>{
            if(doMatch){
                //res.json({message:"Signed In Successfully!"})
                /* Whenever a user signed in successfully we need to give that user a token so that the user
                can access the protected data and we give token on the basis of id stored in our database */
                //we have used jsonwebtoken package to generate tokens
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else{
                return res.status(422).json({error:"Invalid email or password!"})
                /*We returned the same error in compare password and savedUser blocks because if a hacker
                has entered in our website then we don't want to show that the password is wrong and the
                hacker just keeps on trying different passwords and get successful login*/
            }
        }).catch(err=>{
            console.log(err);
        })
    })
})
router.post('/resetpass',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")  //as we recieve a hexadecimal code from buffer so we converted it to string
        User.findOne({email:req.body.email}).then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with that email!"})
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 600000;    //this token will get expired after 10 minutes
            //we are generating token only so that we can set time for resettig password
            user.save().then((result)=>{
                transporter.sendMail({
                    to: user.email,
                    from: "varunjaju677@gmail.com",
                    subject: "Reset Password",
                    html: `
                        <p>You requested for <strong>Reset Password Link</strong></p>
                        <h5><a href="${EMAIL}/reset/${token}">Click here</a> to reset password</h5>
                        <p>Link is only active for 10 minutes.Hurry up!!</p>
                    `
                })
                res.json({message:"Check your mail"})
            }) 
        })
    })
})
router.post('/newpassword',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}}).then(user=>{
        if(!user){
            return res.status(422).json({error:"Time up,session expired!"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then((savedUser)=>{
                res.json({message:"Password Updated"})
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})
module.exports = router;