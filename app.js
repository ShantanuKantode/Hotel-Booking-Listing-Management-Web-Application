const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const listingSchema = require("./schema.js");
//step-3 - mongodb connection
async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
   .then(()=>{
      console.log("connected to DB");
})
.catch((err)=>{
   console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


//step-2 --> root route
// app.get("/",(req,res)=>{
//    res.send("Hii I am Root ");
//    res.render("home.ejs");
// });

app.get("/", async (req, res) => {
   const listings = await Listing.find({}).limit(6); // only 6 for homepage
   res.render("home.ejs", { listings });
});

//Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
  
   const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});

  
}));

//New Route (new route is always at upper of Show route)
app.get("/listings/new",(req,res,next)=>{
   
   res.render("listings/new.ejs");
   
   
});

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
   let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings",wrapAsync(async(req,res,next)=>{
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
   res.redirect("/listings");

}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs" ,{listing});
}));

//Update route
app.put("/listings/:id" ,wrapAsync(async(req,res)=>{
   if(!req.body.listing){
      throw new ExpressError(404,"Send valid data for listings" );
   }

   let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   res.redirect("/listings");
}))

// app.get("/testListing" ,async(req,res)=>{
//     let sampleListing = new Listing({
//       title:"My New Villa",
//       description:"By the beach side",
//       prices:1200,
//       location:"Calanguate,Goa",
//       country:"India",
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");

// });

//All Incoming Request 
app.use((req,res,next)=>{
   next(new ExpressError(404, "Page Not Found !"));
});

//Error Handler
app.use((err,req,res,next)=>{
   //Custom Error Handling with style =>
   // res.send("Somthing went Wrong !");
   

   //ExpressError =>
   let{statusCode = 500, message = "Something Went Wrong"} = err;
   res.status(statusCode).render("error.ejs",{message});
   
 })

//Step-1 -> start server
app.listen(8080,()=>{
   console.log("Server is listening to port 8080")
});

