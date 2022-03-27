const express = require("express")
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

var otp123 = 0
var email = null
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(session({
  secret:"nilay little secret",
  resave: false,
  saveUninitialized: false

}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb+srv://manan:Manan0903$@cluster0.g3bvc.mongodb.net/buspass?retryWrites=true&w=majority");
const userSchema = new mongoose.Schema({
  username:String,
  password:String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy());
passport.serializeUser((User, done) => {
  done(null, User);
});

passport.deserializeUser((User, done) => {
  done(null, User);
});
app.get("/",function(req,res){
  res.render("home")
});
//signup get request
app.get("/signup",function(req,res){
  res.render("signup")
});
//signup post request
app.post("/signup",function(req,res){
  email = req.body.username
User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/signup");
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/user");
      });
    }
  });
});
//login get request
app.get("/login",function(req,res){
  res.render("login");
});
//login post request
app.post("/login",function(req,res){
  if(req.body.username == "mkansara0903@gmail.com" && req.body.password == "Manan0903$"){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/admin")
    });
  }else{
    const user = new User({
  username:req.body.username,
  password:req.body.password
});
req.login(user,function(err){
  if(err){
    console.log(err);
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/otp")
    });
  }
});
  }
});
//otp get request
app.get("/otp",function(req,res){
  if(req.isAuthenticated()){
    res.render("otp")
    "use strict";
    const nodemailer = require("nodemailer");
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();
    
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      function otp(){
        const val = Math.floor(1000 + Math.random() * 9000);
       return val
}

      otp123 = String(otp());
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"omtravels@gmail.com" <foo@example.com>', // sender address
        to:email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: otp123, // plain text body
        html: otp123, // html body
      });

    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    
    main().catch(console.error);
    

  }else{
    res.redirect("/login")
  }
});
//otp post request
app.post("/otp",function(req,res){
 
if(req.body.otp === otp123) {
  res.redirect("/user");
}else{
  console.log("pls enter right password");
  res.redirect("login")
}
});
//admin get request home
app.get("/admin",function(req,res){
  if(req.isAuthenticated()){
    res.render("adminmain");
  }else{
    res.redirect("login");
  }
});
//admin get request tripplanner
app.get("/admin/triplanner",function(req,res){
  if(req.isAuthenticated()){
    res.render("admintriplaner");
  }else{
    res.redirect("login");
  }
});
//admin get request subscriber
app.get("/admin/subscriber",function(req,res){
  if(req.isAuthenticated()){
    res.render("admintotalsubscriber");
  }else{
    res.redirect("login");
  }
});
//logout get
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.listen(3001,function(){
    console.log("your server is running")
});