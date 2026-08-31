const express = require('express');
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");


//Index Route
router.get("/",wrapAsync(async(req,res)=>{
  
const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});

  
}));

//New Route (new route is always at upper of Show route)
router.get("/new",isLoggedIn , (req,res,next)=>{
   
   res.render("listings/new.ejs");
   
   
});

//Show Route
router.get("/:id",wrapAsync(async(req,res,next)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   if (!listing) {
        req.flash("error", "Listing not found. It may have been deleted.");
        return res.redirect("/listings");
    }
  res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",isLoggedIn,wrapAsync(async(req,res,next)=>{
   //method_1 to take input -> create object and insert key
   // let{title,description,image,price,location,country} = req.body;
   
   //check  a Validation
   let result = listingSchema.validate(req.body);
   console.log(result);
   if(result.error){
      throw new ExpressError(400, result.error);
   }
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   req.flash("success" , "New Listing Created !");
   res.redirect("/listings");

}));

//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   
   
   res.render("listings/edit.ejs" ,{listing});
}));

//Update route
router.put("/:id" ,isLoggedIn,wrapAsync(async(req,res)=>{
   if(!req.body.listing){
      throw new ExpressError(404,"Send valid data for listings" );
   }

   let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   
   res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   if(!deleteListing){
      req.flash("error","Listing not found. It may have already been deleted");
      res.redirect("/listings");
   }

   req.flash("success" , "Listing Deleted !");
   res.redirect("/listings");
}))


module.exports = router;