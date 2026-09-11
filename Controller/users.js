const User = require("../models/user");

module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res,next)=>{
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

}

module.exports.renderlogIn = (req,res)=>{
   res.render("users/login.ejs");
}

module.exports.logIn = async(req,res,next)=>{
   try{
       req.flash("success", "Welcome back!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
   }
   catch(err){
      return next(err);
   }
       
}

module.exports.logOut = (req,res,next)=>{
   req.logout((err)=>{
    if(err){
        next(err);
    }
    req.flash("success","User get log out!");
    res.redirect("/listings");
   });

}