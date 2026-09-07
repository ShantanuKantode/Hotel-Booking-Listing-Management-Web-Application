const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const favoritesController = require("../Controller/favorites.js");

router.get("/", isLoggedIn, wrapAsync(favoritesController.index));

router.route("/:listingId")
   .post(isLoggedIn, wrapAsync(favoritesController.addFavorite))
   .delete(isLoggedIn, wrapAsync(favoritesController.removeFavorite));

module.exports = router;
