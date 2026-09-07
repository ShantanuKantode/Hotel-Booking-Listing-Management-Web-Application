const mongoose = require("mongoose");
const Listing = require("../listing.js");

const categoriesByTitle = {
  "Cozy Beachfront Cottage": "Beach",
  "Modern Loft in Downtown": "Rooms",
  "Mountain Retreat": "Mountain",
  "Historic Villa in Tuscany": "Farms",
  "Secluded Treehouse Getaway": "Cabins",
  "Beachfront Paradise": "Beach",
  "Rustic Cabin by the Lake": "Lakefront",
  "Luxury Penthouse with City Views": "Rooms",
  "Ski-In/Ski-Out Chalet": "Mountain",
  "Safari Lodge in the Serengeti": "Hotels",
  "Historic Canal House": "Rooms",
  "Private Island Retreat": "Beach",
  "Charming Cottage in the Cotswolds": "Farms",
  "Historic Brownstone in Boston": "Rooms",
  "Beachfront Bungalow in Bali": "Beach",
  "Mountain View Cabin in Banff": "Mountain",
  "Art Deco Apartment in Miami": "Rooms",
  "Tropical Villa in Phuket": "Amazing Pools",
  "Historic Castle in Scotland": "Hotels",
  "Desert Oasis in Dubai": "Amazing Pools",
  "Rustic Log Cabin in Montana": "Cabins",
  "Beachfront Villa in Greece": "Beach",
  "Eco-Friendly Treehouse Retreat": "Cabins",
  "Historic Cottage in Charleston": "Rooms",
  "Modern Apartment in Tokyo": "Rooms",
  "Lakefront Cabin in New Hampshire": "Lakefront",
  "Luxury Villa in the Maldives": "Amazing Pools",
  "Ski Chalet in Aspen": "Mountain",
  "Secluded Beach House in Costa Rica": "Beach",
};

async function backfillCategories() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

  const operations = Object.entries(categoriesByTitle).map(([title, category]) => ({
    updateOne: {
      filter: { title, category: null },
      update: { $set: { category } },
    },
  }));

  const result = await Listing.bulkWrite(operations);
  console.log(`${result.modifiedCount} listing categories added.`);
  await mongoose.disconnect();
}

backfillCategories().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
