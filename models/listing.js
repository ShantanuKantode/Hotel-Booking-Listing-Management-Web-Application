const mongoose = require("mongoose");
const review = require("./review");
const Schema  = mongoose.Schema;


const listingSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   description:String,
   image:{
     url: String,
     filename: String,
   },
   price:Number,
   location:String,
   country:String,
   reviews:[
      {
          type:Schema.Types.ObjectId,
          ref:"Review",
      }
   ],
    category: {
        type: String,
        enum: [
            "Mountain",
            "Beach",
            "Lakefront",
            "Farms",
            "Amazing Pools",
            "Cabins",
            "Rooms",
            "Hotels"
        ]
    },
   owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
   },

});

//To delete A review with respective to listing
listingSchema.post("findOneAndDelete" , async(listing)=>{
   if(listing){
      await review.deleteMany({_id : {$in : listing.reviews}})
   }
   
}
)

const Listing= mongoose.model("Listing",listingSchema);
module.exports = Listing;