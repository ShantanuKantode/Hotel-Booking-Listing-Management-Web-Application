const express = require('express');
const router= express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../Controller/reviews.js");


//Review POST Route -(POST)
router.post("/", 
   isLoggedIn,
   validateReview ,
    wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId" ,
   isLoggedIn,
   isAuthor,
   wrapAsync(reviewController.deleteReview))


module.exports = router;