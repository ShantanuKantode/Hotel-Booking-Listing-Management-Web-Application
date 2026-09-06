const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");
const express = require('express');
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../Controller/listings.js");

//Index Route
router.get("/",wrapAsync(listingController.index));

//New Route (new route is always at upper of Show route)
router.get("/new",isLoggedIn , listingController.renderNewForm);

//Show Route
router.get("/:id",wrapAsync(listingController.showListing));

//Create Route
router.post("/",
   isLoggedIn,
   validateListing,
   wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",
   isLoggedIn,
   validateListing,
   wrapAsync(listingController.editListing));

//Update route
router.put("/:id" ,
   isLoggedIn,
   isOwner,
   validateListing,
   wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",
   isLoggedIn,
   isOwner,
   validateListing,
   wrapAsync(listingController.deleteListing));

module.exports = router;