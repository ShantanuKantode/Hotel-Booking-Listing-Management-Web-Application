const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");
const express = require('express');
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");


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
   const listing = await Listing.findById(id)
   .populate({
      path :"reviews" ,
      populate :  {path : "author"} // nested populate
      })
      .populate("owner");
   if (!listing) {
        req.flash("error", "Listing not found. It may have been deleted.");
        return res.redirect("/listings");
    }
    console.log(listing);
  res.render("listings/show.ejs",{listing});
}));

//Create Route
router.post("/",
   isLoggedIn,
   validateListing,
   wrapAsync(async(req,res,next)=>{
   //method_1 to take input -> create object and insert key
   // let{title,description,image,price,location,country} = req.body;
   
   //check  a Validation
   let result = listingSchema.validate(req.body);
   console.log(result);
   if(result.error){
      throw new ExpressError(400, result.error);
   }
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;  //owner with listing
   await newListing.save();
   req.flash("success" , "New Listing Created !");
   res.redirect("/listings");

}));

//Edit Route
router.get("/:id/edit",
   isLoggedIn,
   validateListing,
   wrapAsync(async(req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
      req.flash("error","Listing not found !");
      res.redirect("/listings");
   }
   res.render("listings/edit.ejs" ,{listing});
}));

//Update route
router.put("/:id" ,
   isLoggedIn,
   isOwner,
   validateListing,
   wrapAsync(async(req,res)=>{
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("success","Listing Updated !");
   res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",
   isLoggedIn,
   isOwner,
   validateListing,
   wrapAsync(async(req,res)=>{
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