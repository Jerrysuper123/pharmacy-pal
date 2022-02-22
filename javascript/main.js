function initMap() {
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

  return map;
}

async function main() {
  async function init() {
    let map = initMap();

    //leaflet routing services 
    L.Routing.control({
      waypoints: [
        L.latLng(1.3590, 103.7637),
        L.latLng(1.3061, 103.8832)
      ],
      routeWhileDragging: true
    }).addTo(map);
    
    //get user location and put on a marker
    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
  
    function success(pos) {
      let crd = pos.coords;
      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
  
      let lat = crd.latitude;
      let lng = crd.longitude;
      
      let userMaker = L.marker([lat, lng]);
      userMaker.bindPopup("You are here!");
      userMaker.addTo(map);
      map.flyTo([lat,lng],15);
      userMaker.openPopup();
    }
  
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      alert("Please allow us to access your location to find the pharmacy near you!")
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);

    window.addEventListener("DOMContentLoaded", async function () {
      let searchDataArray = await extractAddressForSearch();
      let searchResultLayer = L.layerGroup();
      document
        .querySelector("#searchBtn")
        .addEventListener("click", function (event) {
          event.preventDefault();

          searchResultLayer.clearLayers();
          let searchString = document.querySelector("#searchString").value;
          let filteredResult = searchDataArray.filter((el) =>
            el[0].includes(searchString.toLowerCase())
          );

          let resultDiv = document.querySelector("#result");
          resultDiv.innerHTML = "";

          for (el of filteredResult) {
            //create marker based on filteredResult;
            let lat = Number(el[1]);
            let lng = Number(el[2]);
            let address = el[0];
            let pharmacistName = el[3];
            let marker = L.marker([lat, lng]);
            marker.bindPopup(`
          <ul>
            <li>${address}</li>
            <li>${pharmacistName}</li>
          </ul>
          `);
            marker.addTo(searchResultLayer);

            //create search result list and add event listener to each result
            let divElement = document.createElement("div");
            divElement.innerHTML = el[0].split(",")[0];
            divElement.addEventListener("click", function () {
              map.flyTo([lat, lng], 15);
              marker.openPopup();
            });

            resultDiv.appendChild(divElement);
          }
        });
      searchResultLayer.addTo(map);
    });
  }
  init();
}

main();
// let addressesForSearch = await extractAddressForSearch();
