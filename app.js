const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");

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

//step-2 --> root route
app.get("/",(req,res)=>{
   res.send("Hii I am Root ");
});

//Index Route
app.get("/listings",async(req,res)=>{
  const allListing = await Listing.find({});
  res.render("listings/index.ejs",{allListing});
});

//New Route (new route is always at upper of Show route)
app.get("/listings/new",(req,res)=>{
   res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",async(req,res)=>{
   let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings",async(req,res)=>{
   //method_1 to take input -> create object and insert key
   // let{title,description,image,price,location,country} = req.body;

   //method 2
   
   const newListing = new Listing(req.body.listing);
   console.log(newListing.save());
   res.redirect("/listings");
  
});

//Edit Route
app.get("/listings/:id/edit",async(req,res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/edit.ejs" ,{listing});
});

//Update route
app.put("/listings/:id" ,async(req,res)=>{
   let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
   let {id} = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
   console.log(deleteListing);
   res.redirect("/listings");
})

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


//Step-1 -> start server
app.listen(8080,()=>{
   console.log("Server is listening to port 8080")
});

