const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");

module.exports.index=async(req,res)=>{
  const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res,next)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res,next)=>{
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
};

module.exports.createListing = async(req,res,next)=>{
   
   const url = req.file.path;
   const filename = req.file.filename;
   
   const newListing = new Listing(req.body.listing);
   newListing.owner = req.user._id;  //owner with listing
   newListing.image = {url , filename};
   await newListing.save();
   req.flash("success" , "New Listing Created !");
   res.redirect("/listings");
}

module.exports.editListing = async(req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing){
      req.flash("error","Listing not found !");
      res.redirect("/listings");
   }
   res.render("listings/edit.ejs" ,{listing});
}

module.exports.updateListing = async(req,res)=>{
   let { id } = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   req.flash("success","Listing Updated !");
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   if(!deleteListing){
      req.flash("error","Listing not found. It may have already been deleted");
      res.redirect("/listings");
   }

   req.flash("success" , "Listing Deleted !");
   res.redirect("/listings");
}