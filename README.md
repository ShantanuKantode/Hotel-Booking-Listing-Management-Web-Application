# 🏨 WanderLust - Hotel & Property Listing Platform

**🚀 Live Demo**: [https://horizone-rnn3.onrender.com](https://horizone-rnn3.onrender.com?utm_source=chatgpt.com)

WanderLust is a full-stack hotel and property listing platform where users can discover, explore, and manage accommodation listings through an interactive travel-focused interface.

The application provides a complete listing management experience with user authentication, property search and filtering, favorites, reviews and ratings, image uploads, and interactive location maps.

The project focuses on solving common real-world travel platform requirements, including:

* **Property Management**: Create, view, update, and delete hotel and accommodation listings.
* **Secure Authentication**: User registration, login, logout, sessions, and protected resources.
* **Smart Discovery**: Search properties by location and filter listings by categories.
* **Favorites System**: Save and manage preferred properties for quick access.
* **Reviews & Ratings**: Users can rate properties and share reviews with calculated ratings.
* **Interactive Maps**: Display property locations using Leaflet and OpenStreetMap.
* **Cloud Image Uploads**: Property images are uploaded and managed through Cloudinary.
* **Location Geocoding**: Property locations are converted into geographic coordinates using Nominatim.

---

## 🚀 Key Features

### 🏠 Property Listings

* Browse available properties and accommodations.
* View detailed property information.
* Create new property listings.
* Edit and delete owned listings.
* Upload property images.
* Organize properties using categories.
* Display property location on an interactive map.

### 🔍 Search & Discovery

* Search properties by title, location, or country.
* Browse properties through category-based filters.
* Sort and explore listings based on available ratings.
* Responsive listing interface for easier property discovery.

### ❤️ Favorites

* Add properties to a personal favorites list.
* Remove properties from favorites.
* View all saved properties.
* Prevent duplicate favorite entries.

### ⭐ Reviews & Ratings

* Submit reviews for properties.
* Add ratings from 1–5 stars.
* Display average property ratings.
* Show review counts and rating distribution.
* Users can manage their own reviews.

### 👤 User Authentication

* User registration and login.
* Session-based authentication.
* Protected routes for authenticated users.
* Listing ownership authorization.
* Review ownership authorization.
* Secure logout functionality.

### 🗺️ Interactive Location Maps

* Display property locations using interactive maps.
* Convert property locations into coordinates.
* GeoJSON-based location data.
* Map markers for individual properties.
* OpenStreetMap integration through Leaflet.

---

## 🛠️ Technology Stack

### Frontend

<p>
  <a href="https://ejs.co/">
    <img src="https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black" alt="EJS"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  </a>
  <a href="https://getbootstrap.com/">
    <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  </a>
  <a href="https://leafletjs.com/">
    <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet"/>
  </a>
</p>

### Backend

<p>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  </a>
  <a href="https://www.passportjs.org/">
    <img src="https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black" alt="Passport.js"/>
  </a>
  <a href="https://www.npmjs.com/package/express-session">
    <img src="https://img.shields.io/badge/Express%20Session-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Session"/>
  </a>
  <a href="https://joi.dev/">
    <img src="https://img.shields.io/badge/Joi-Validation-6B4FBB?style=for-the-badge" alt="Joi"/>
  </a>
  <a href="https://www.npmjs.com/package/multer">
    <img src="https://img.shields.io/badge/Multer-File%20Upload-FF6B35?style=for-the-badge" alt="Multer"/>
  </a>
</p>

### Database

<p>
  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  </a>
  <a href="https://www.mongodb.com/atlas">
    <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas"/>
  </a>
  <a href="https://mongoosejs.com/">
    <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
  </a>
</p>

### Cloud & APIs

* **Cloudinary** — Property image storage and delivery
* **OpenStreetMap** — Interactive map data
* **Nominatim API** — Location geocoding
* **Render** — Application deployment

---

## 🔗 APIs & Services

### 📍 Nominatim API

Used to convert property location information into geographical coordinates for map integration.

**Location → Latitude & Longitude → Interactive Map**

### 🗺️ OpenStreetMap

Provides map tiles and geographical map data used by the application's Leaflet-based maps.

### ☁️ Cloudinary

Used for cloud-based property image storage and delivery instead of storing image files directly inside MongoDB.

---

## 📂 Project Structure

```text
WanderLust/
│
├── Config/
│   └── cloudConfig.js
│
├── Controller/
│   ├── favorites.js
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── Routes/
│   ├── favorites.js
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/
│   ├── layouts/
│   ├── includes/
│   ├── listings/
│   ├── users/
│   └── favorites/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── app.js
├── middleware.js
├── schema.js
├── package.json
└── README.md
```

---

## ⚙️ Setup & Execution

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd WanderLust
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database & Services

Configure your MongoDB Atlas, Cloudinary, and session credentials according to the project configuration.

### 4. Start the Application

```bash
node app.js
```

The application will be available locally at:

```text
http://localhost:8080
```

---

## 🌐 Deployment

The application is deployed on **Render** with MongoDB Atlas used as the cloud database and Cloudinary used for property image management.

**Production Application**:

[https://horizone-rnn3.onrender.com](https://horizone-rnn3.onrender.com?utm_source=chatgpt.com)

---
---

## 🔮 Future Enhancements

* Online hotel booking and reservation system
* Availability calendar
* Payment gateway integration
* Host and admin dashboards
* Booking history
* Email notifications
* AI-powered property recommendations
* AI travel assistant
* Advanced location-based search
* Real-time messaging
* Dockerized deployment and CI/CD

---

## 👨‍💻 Developer

**Shantanu Kantode**

Full-Stack Developer | JavaScript | Node.js | Express.js | MongoDB

---

<p align="center">
  ⭐ If you like this project, consider giving the repository a star!
</p>
