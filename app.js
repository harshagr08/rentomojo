const express = require("express");
const app = express();
const auth = require("./routes/auth");
const home =require("./routes/home")
const bodyparser = require("body-parser");
const path=require('path')
const mongoose=require('mongoose')
const flash=require('connect-flash')
const session=require('express-session')
const mongodbstore=require('connect-mongodb-session')(session)
const User=require('./modals/User')
const errorcontroller=require('./controllers/error')

app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("ejs", "ejs");

const store=new mongodbstore({ 
  uri:'mongodb://127.0.0.1/rentomojo',
  collection:'sessions' 
 }) 
app.use( 
  session({ secret: "My secret", resave: false, saveUninitialized: false,store:store}) 
 ); 

app.use(flash()) 
app.use((req,res,next)=>{

  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id).then(user=>{
    req.user=user
    next()
  })
  
})

app.use((req,res,next)=>{
  res.locals.isauth=req.session.isauth
  next()
})



app.use(auth);
app.use(home)
app.use(errorcontroller.geterror)

mongoose 
 .connect( "mongodb://127.0.0.1/rentomojo"  )
 .then(result => { 
   console.log("Connected"); 
   app.listen(3000); 
 }); 