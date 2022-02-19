async function readPharmacyLocationJson() {
  let response = await axios.get("../localData/pharmacyLocation.geojson");

  let pharmacyLocationLayer = L.geoJson(response.data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.Description);
    },
  }).addTo(map);
  pharmacyLocationLayer.setStyle({
    color: "red",
  });

  return pharmacyLocationLayer;
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

window.addEventListener("DOMContentLoaded", function () {
  readPharmacyLocationJson();
});
