const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");
const express = require('express');
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../Controller/listings.js");


router.route("/")
.get(wrapAsync(listingController.index))   //Index Route
.post(                                    //Create Route
   isLoggedIn,
   validateListing,
   wrapAsync(listingController.createListing));

//New Route (new route is always at upper of Show route)
router.get("/new",isLoggedIn , listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing)) //Show Route
.put(                                         //Update route
   isLoggedIn,
   isOwner,
   validateListing,
   wrapAsync(listingController.updateListing))
.delete(                                   //Delete Route
   isLoggedIn,
   isOwner,
   wrapAsync(listingController.deleteListing));


//Edit Route
router.get("/:id/edit",
   isLoggedIn,
   validateListing,
   wrapAsync(listingController.editListing));


module.exports = router;