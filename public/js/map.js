
   //  let mapToken = window.mapToken;
   //  console.log(mapToken);
   //  mapboxgl.accessToken = mapToken;

   //  const map = new mapboxgl.Map({
   //      container: "map", // container ID
   //      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
   //      style: "mapbox://styles/mapbox/streets-v12",
   //      center: [72.8777, 19.0760], // starting position [lng, lat]
   //      zoom: 9, // starting zoom
   //  });


const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([20.5937, 78.9629])
    .addTo(map)
    .bindPopup("India")
    .openPopup();
   