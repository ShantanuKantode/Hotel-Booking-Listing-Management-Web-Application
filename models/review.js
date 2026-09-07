const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const reviewSchema = new Schema({
   comment : String,
   rating:{
      type:Number,
      min:1,
      max:5,
      validate: {
         validator: Number.isInteger,
         message: "Rating must be a whole number between 1 and 5.",
      },
   },
   createdAt:{
      type:Date,
      default:Date.now()
   },
   author:{
      type:Schema.Types.ObjectId,
      ref:"User"
   },
   listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
   },
})

reviewSchema.index(
   { author: 1, listing: 1 },
   {
      unique: true,
      partialFilterExpression: { listing: { $type: "objectId" } },
   }
);

module.exports = mongoose.model("Review", reviewSchema);
