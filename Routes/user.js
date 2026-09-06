const express = require('express');
const router= express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");

const userController = require("../Controller/users");

router.route("/signup")
.get( userController.renderSignUp )
.post( wrapAsync(userController.signUp));


router.route("/login")
.get( userController.renderlogIn)
.post( 
    saveRedirectUrl,
    passport.authenticate("local" ,{
        failureRedirect : "/login",
        failureFlash : true,
    }),
    userController.logIn,
);


router.get("/logout", userController.logOut);



module.exports = router;
