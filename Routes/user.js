const express = require('express');
const router= express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");

const userController = require("../Controller/users");

router.get("/signup", userController.renderSignUp );

router.post("/signup" , wrapAsync(userController.signUp));

router.get('/login' , userController.renderlogIn);

router.post("/login" , 
    saveRedirectUrl,
    passport.authenticate("local" ,{
        failureRedirect : "/login",
        failureFlash : true,
    }),
    userController.logIn,
);


router.get("/logout", userController.logOut);



module.exports = router;
