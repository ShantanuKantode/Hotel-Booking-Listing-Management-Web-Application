const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const { listingSchema } = require("../schema");

const categories = [
   "Mountain",
   "Beach",
   "Lakefront",
   "Farms",
   "Amazing Pools",
   "Cabins",
   "Rooms",
   "Hotels",
];

const getRatingSummary = (reviews) => {
   const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
   const validReviews = reviews.filter((review) => Number.isInteger(review.rating));
   const reviewCount = validReviews.length;
   const totalRating = validReviews.reduce((sum, review) => {
      ratingDistribution[review.rating] += 1;
      return sum + review.rating;
   }, 0);

   return {
      reviewCount,
      averageRating: reviewCount ? Number((totalRating / reviewCount).toFixed(1)) : null,
      ratingDistribution,
      ratingPercentages: Object.fromEntries(
         Object.entries(ratingDistribution).map(([rating, count]) => [
            rating,
            reviewCount ? Math.round((count / reviewCount) * 100) : 0,
         ])
      ),
   };
};

module.exports.index=async(req,res)=>{
   const { category, sort } = req.query;
   const selectedCategory = categories.includes(category) ? category : null;
   const match = selectedCategory ? { category: selectedCategory } : {};
   const allListing = await Listing.aggregate([
      { $match: match },
      {
         $lookup: {
            from: "reviews",
            localField: "reviews",
            foreignField: "_id",
            as: "reviewData",
         },
      },
      {
         $addFields: {
            reviewCount: { $size: "$reviewData" },
            averageRating: {
               $cond: [
                  { $gt: [{ $size: "$reviewData" }, 0] },
                  { $round: [{ $avg: "$reviewData.rating" }, 1] },
                  null,
               ],
            },
         },
      },
      ...(sort === "rating" ? [{ $sort: { averageRating: -1, _id: 1 } }] : []),
      { $project: { reviewData: 0 } },
   ]);
   const favoriteIds = new Set(
      (req.user?.favorites || []).map((favoriteId) => favoriteId.toString())
   );

   res.render("listings/index.ejs", { allListing, selectedCategory, favoriteIds });
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
  const ratingSummary = getRatingSummary(listing.reviews);
  const favoriteIds = new Set(
     (req.user?.favorites || []).map((favoriteId) => favoriteId.toString())
  );
  const canReview = Boolean(req.user) && !listing.reviews.some(
     (review) => review.author && review.author._id.equals(req.user._id)
  );
  res.render("listings/show.ejs", { listing, favoriteIds, ratingSummary, canReview });
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
   let orgImage = listing.image.url;  
   orignalImageUrl = orgImage.replace("/upload" , "/upload/w_300")
   res.render("listings/edit.ejs" ,{listing , orignalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
   let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
   
   if(typeof req.file !== "undefined"){
   const url = req.file.path;
   const filename = req.file.filename;
   listing.image= {url,filename};
   await listing.save();
   }
   

   req.flash("success","Listing Updated !");
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   if(!deleteListing){
      req.flash("error","Listing not found. It may have already been deleted");
      return res.redirect("/listings");
   }

   await User.updateMany({ favorites: id }, { $pull: { favorites: id } });

   req.flash("success" , "Listing Deleted !");
   res.redirect("/listings");
}
