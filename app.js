if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

const sessionSecret = process.env.SECRET;

const sessionOption = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");
const favoritesRouter = require("./Routes/favorites.js");

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));


/* HOME PAGE */

app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const listings = await Listing.find({}).limit(6);
        res.render("index.ejs", { listings });
    })
);


/* ROUTES */

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/favorites", favoritesRouter);

app.use("/", userRouter);


/* 404 ERROR */

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


/* ERROR HANDLER */

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something Went Wrong";

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("error.ejs", {
        message,
    });
});


/* START SERVER */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});