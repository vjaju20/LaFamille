//8LJLdsilocYPVwvA
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000; // we have to provide server a port to work on
app.use(cors());   // to overcome cors problem
const {MONGOURI} = require('./config/keys');
mongoose.connect(MONGOURI,{
    useNewUrlParser : true,
    useUnifiedTopology : true
});
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB database");
})
mongoose.connection.on('error',(err)=>{
    console.log("Err connecting",err);
})
//Everything needs to be done after the connection to the database
require('./models/user'); //registered our userSchema
require('./models/post'); //registered our postSchema
app.use(express.json()); //parsing all the incoming requests and acting as a middleware before reaching the actual route handler
app.use(require('./routes/auth')) //registered our routes our authorization route handler
app.use(require('./routes/post')) //registered our routes our post route handler
app.use(require('./routes/user')) //registered our routes our user route handler
//mongoose.model("User"); //using the created model
/*const customMiddleware = (req,res,next) =>{
    console.log("Middleware Executed!");
    next();
}
//app.use(customMiddleware);->//applied for all the routes
app.get('/',(req,res)=>{
    console.log("home");
    res.send("hello world");
})
//app.get('/about',customMiddleware,(req,res))-> Now the middleware works only for about route
app.get('/about',customMiddleware,(req,res)=>{
    console.log("about");
    res.send("about page");
})*/
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,()=>{
    console.log("Server is running on ",PORT);
})