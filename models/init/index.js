const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../listing.js");


async function main(){

   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}

main()

   .then(()=>{

      console.log("connected to DB");

      initDB();

})

.catch((err)=>{

   console.log(err);

})


const initDB = async() => {

  console.log("Starting database initialization...");

  await Listing.deleteMany({});

  console.log("Old listings deleted.");

  const ownerWithListing = [];

  for (const obj of initData.data) {

    console.log(
      `Searching location: ${obj.location}, ${obj.country}`
    );

    try {

      const query = `${obj.location}, ${obj.country}`;

      const response = await fetch(
        "https://nominatim.openstreetmap.org/search?" +
        "format=json" +
        `&q=${encodeURIComponent(query)}` +
        "&limit=1",
        {
          headers: {
            "User-Agent": "WanderLust/1.0"
          }
        }
      );

      const data = await response.json();

      if (data.length > 0) {

        const latitude = Number(data[0].lat);
        const longitude = Number(data[0].lon);

        ownerWithListing.push({

          ...obj,

          owner: "6a92d9028a700fd233ba1fb5",

          geometry: {
            type: "Point",
            coordinates: [
              longitude,
              latitude
            ]
          }

        });

        console.log(
          `Location found: ${obj.location}, ${obj.country}`
        );

      } else {

        console.log(
          `Location NOT found: ${obj.location}, ${obj.country}`
        );

        ownerWithListing.push({

          ...obj,

          owner: "6a92d9028a700fd233ba1fb5"

        });

      }

    } catch (error) {

      console.log(
        `Error for ${obj.location}:`,
        error.message
      );

    }

    await new Promise(resolve => setTimeout(resolve, 1100));

  }


  console.log("Inserting listings...");

  await Listing.insertMany(ownerWithListing);

  console.log("data was initilized");

};