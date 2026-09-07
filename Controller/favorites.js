const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListingId = (listingId) => {
   if (!mongoose.isValidObjectId(listingId)) {
      throw new ExpressError(400, "Invalid listing ID.");
   }
};

module.exports.index = async (req, res) => {
   const user = await User.findById(req.user._id).populate("favorites");
   const favoriteListingIds = user.favorites
      .filter(Boolean)
      .map((listing) => listing._id);
   const ratedListings = await Listing.aggregate([
      { $match: { _id: { $in: favoriteListingIds } } },
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
      { $project: { reviewData: 0 } },
   ]);
   const listingsById = new Map(
      ratedListings.map((listing) => [listing._id.toString(), listing])
   );
   const listings = favoriteListingIds
      .map((listingId) => listingsById.get(listingId.toString()))
      .filter(Boolean);
   const favoriteIds = new Set(favoriteListingIds.map((listingId) => listingId.toString()));

   res.render("favorites/index.ejs", { listings, favoriteIds });
};

module.exports.addFavorite = async (req, res) => {
   const { listingId } = req.params;
   validateListingId(listingId);

   const listingExists = await Listing.exists({ _id: listingId });
   if (!listingExists) {
      throw new ExpressError(404, "Listing not found.");
   }

   await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { favorites: listingId } }
   );

   res.status(200).json({ favorited: true });
};

module.exports.removeFavorite = async (req, res) => {
   const { listingId } = req.params;
   validateListingId(listingId);

   await User.updateOne(
      { _id: req.user._id },
      { $pull: { favorites: listingId } }
   );

   res.status(200).json({ favorited: false });
};
