const express = require('express');
const router= express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req,res)=>{
  try{
   const{username,email,password} = req.body;
   const newUser = User({username,email});
   const newRegister = await User.register(newUser,password);

   req.login(newRegister , (err)=>{
     if(err){
      return next(err);
    }
    req.flash("success","User get log In!");
    res.redirect("/listings");
   })
   }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
  
}));

router.get('/login' , (req,res)=>{
  
    res.render("users/login.ejs");
});

router.post("/login" , 
    passport.authenticate("local" ,{
        failureRedirect : "/login",
        failureFlash : true,
    }),
    async(req,res)=>{
        req.flash("success","Welcome ! You are loggeed in !");
        res.redirect("/listings");
    }
);


router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
    if(err){
        next(err);
    }
    req.flash("success","User get log out!");
    res.redirect("/listings");
   })

});



module.exports = router;
