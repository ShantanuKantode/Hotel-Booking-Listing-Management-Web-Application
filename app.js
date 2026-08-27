const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Express-Session
const sessionOption = {
   secret:"mysecret",
   resave:false,
   saveUninitialized: true,
   //cookie-option
   cookie:{
      expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly :true,
   }
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success =  req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

// app.get("/demouser",async(req,res)=>{
//    let fakeUser = new User({
//       email:"student@123.com",
//       username:"student123",
//    });
   
//    const user = await User.register(fakeUser,"pass@123");
//    res.send(user);
//    console.log(user);
// });

//Router
const listingRouter= require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

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






app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);



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

