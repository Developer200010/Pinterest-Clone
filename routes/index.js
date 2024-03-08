var express = require('express');
var router = express.Router();
const userModel = require("./users")

const localStrategy = require("passport-local");
// user login
const passport = require('passport');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req,res,next){
  res.render("index");
})

router.get('/login', function(req,res){
  res.render('login');
})

router.get('/profile',isLoggedIn,function(req,res){
  res.send("welcome to profile page");
})

router.post('/register', function(req,res){
  const { username, fullname, email } = req.body;
  const userData = new userModel({ username, fullname, email });
  userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

router.post('/login', passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/"
}),function(req,res){ })

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
    
  res.redirect('/');
}

module.exports= router;