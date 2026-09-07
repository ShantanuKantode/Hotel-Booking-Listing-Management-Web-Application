const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview =  async (req, res) => {
   const { id } = req.params;
   if (!mongoose.isValidObjectId(id)) {
      throw new ExpressError(400, "Invalid listing ID.");
   }

   const listing = await Listing.findById(id);
   if (!listing) {
      throw new ExpressError(404, "Listing not found.");
   }

   const existingReview = await Review.exists({
      author: req.user._id,
      $or: [
         { listing: listing._id },
         { _id: { $in: listing.reviews } },
      ],
   });

   if (existingReview) {
      req.flash("error", "You have already reviewed this listing.");
      return res.redirect(`/listings/${listing._id}`);
   }

   const newReview = new Review({ ...req.body.review, listing: listing._id });
   newReview.author = req.user._id;
   listing.reviews.push(newReview);

   try {
      await newReview.save();
      await listing.save();
   } catch (error) {
      if (error.code === 11000) {
         req.flash("error", "You have already reviewed this listing.");
         return res.redirect(`/listings/${listing._id}`);
      }
      throw error;
   }

   req.flash("success" , "Review Added !");
   res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res)=>{
   let {id, reviewId} = req.params;

   await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}})
   await Review.findByIdAndDelete(reviewId);
   req.flash("success" , "Review Deleted !");
   res.redirect(`/listings/${id}`);

}
