
document.addEventListener("DOMContentLoaded", () => {

    const mapElement = document.getElementById("map");

    if (!mapElement) {
        return;
    }

const latitudeValue =
    mapElement.dataset.lat;

const longitudeValue =
    mapElement.dataset.lng;

const latitude =
    Number(latitudeValue);

const longitude =
    Number(longitudeValue);

const title =
    mapElement.dataset.title || "Listing";

const location =
    mapElement.dataset.location || "";

const country =
    mapElement.dataset.country || "";



if (
    latitudeValue === "" ||
    longitudeValue === "" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
) {

    console.error(
        "Listing does not have valid coordinates."
    );

    mapElement.innerHTML = `
        <div class="map-error">
            <i class="fa-solid fa-location-dot"></i>
            <p>
                Location coordinates are not available.
            </p>
        </div>
    `;

    return;
}
    



    const map = L.map("map", {

        center: [
            latitude,
            longitude
        ],

        zoom: 13,

        scrollWheelZoom: true

    });


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                'OpenStreetMap</a> contributors'
        }
    ).addTo(map);


    const marker = L.marker([
        latitude,
        longitude
    ]).addTo(map);




    marker.bindPopup(`
        <div class="map-popup">

            <div class="map-popup-title">
                ${escapeHtml(title)}
            </div>

            <div class="map-popup-location">
                <i class="fa-solid fa-location-dot"></i>
                ${escapeHtml(location)}, 
                ${escapeHtml(country)}
            </div>

            <div class="map-popup-coordinates">

                <span>
                    Latitude:
                </span>

                <strong>
                    ${latitude.toFixed(6)}
                </strong>

                <br>

                <span>
                    Longitude:
                </span>

                <strong>
                    ${longitude.toFixed(6)}
                </strong>

            </div>

        </div>
    `);




    marker.openPopup();



    setTimeout(() => {

        map.invalidateSize();

    }, 100);




    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});