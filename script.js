// alert("hello");
async function readPharmacyLocationJson() {
  let response = await axios.get("pharmacyLocation.geojson");
  //   console.log(response.data);
  //   return response.data;

  //better extract the data and add event listerner to each marker
  let pharmacyLocationLayer = L.geoJson(response.data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.Description);
    },
  }).addTo(map);

  //it is not changing the style of it
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
    // you have to get accessToken from mapbox
    // there is a limit how much u can access
    accessToken:
      "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw", //demo access token
  }
).addTo(map);

window.addEventListener("DOMContentLoaded", function () {
  readPharmacyLocationJson();
});
