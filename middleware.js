module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
      req.flash("error","User is not loggedIn !");
      return res.redirect("/login");
   }
   next();
}