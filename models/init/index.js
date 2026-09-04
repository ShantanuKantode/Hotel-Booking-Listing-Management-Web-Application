const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../listing.js");


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

const initDB = async() => {
  await Listing.deleteMany({});
   const ownerWithListing = initData.data.map((obj)=> ({
   ...obj,
   owner:  "6a92d9028a700fd233ba1fb5",
}))  //owner get stored into new array
  await Listing.insertMany( ownerWithListing );
  console.log("data was initilized");
};

initDB();