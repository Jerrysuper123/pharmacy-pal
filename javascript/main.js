window.addEventListener("DOMContentLoaded", function () {
  readPharmacyLocationJson();
});

async function readPharmacyLocationJson() {
  let response = await axios.get("../localData/pharmacyLocation.geojson");

  let locationArray = response.data.features;

  // return locationArray;
  let columns;
  for (let el of locationArray) {
    let lat = Number(el.geometry.coordinates[1]);
    let lng = Number(el.geometry.coordinates[0]);
    let description = el.properties.Description;
    let marker = L.marker([lat, lng]);

    //create marker description
    let dummyDiv = document.createElement("div");
    dummyDiv.innerHTML = description;
    //extract all table data from geoJson data
    columns = dummyDiv.querySelectorAll("td");

    let pharmacyName = columns[6].innerHTML;
    let buildingName = columns[1].innerHTML;
    let blkNo = columns[5].innerHTML;
    let roadName = columns[4].innerHTML;
    let levelNo = columns[3].innerHTML;
    let unitNo = columns[2].innerHTML;
    let postalCode = columns[0].innerHTML;

    marker.bindPopup(`
    <ul>
      <li>${pharmacyName}</li>
      <li>${buildingName}</li>
      <li>Blk ${blkNo} ${roadName} #${levelNo}-${unitNo}</li>
      <li>Singapore ${postalCode}</li>
    </ul>
    `);

    //testing to see the full table
    // marker.bindPopup(description);

    marker.addTo(markerClusterGroup);
  }
  // return columns;
}

let singapore = [1.29, 103.85];

let map = L.map("singaporeMap").setView(singapore, 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", //demo access token
  }
).addTo(map);

let markerClusterGroup = L.markerClusterGroup();
markerClusterGroup.addTo(map);
