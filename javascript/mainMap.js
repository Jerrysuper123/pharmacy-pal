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

function createPopUpContent(name, pharmacistName, address) {
  let htmlString = `
  <h1 class="m-0">${name}</h1>
  <div class="d-flex align-items-center my-2">
    <i class="fa-solid fa-user-nurse markerAvatar me-3"></i>
    <section>
      <p class="fw-bold m-0">Registered Pharmacist</p>
      <p class="my-1">Name: <span class="keyInfo"> ${pharmacistName} </span> </p>
      <p class="m-0 p-0">Experience: <i class="fa-solid fa-ellipsis keyInfo"></i></p>
    </section/>
  </div>
  <p class="address subText"><i class="fa-solid fa-location-dot"></i> ${address}</p>
  `;
  return htmlString;
};

function createCustomMarkerIcon(imageUrl) {
  //customized pharmacy location marker
  let icon = L.Icon.extend({
    options: {
      //iconsize - width and height
      iconSize: [37, 40],
      //iconAnchor: x axis in pixel, y axis in pixel (based on left up corner of image as 0,0 coord)
      iconAnchor: [0, 0],
      //popupachor: x axis in pixel, y axis in pixel (based on image anchor)
      popupAnchor: [16, -3]
    }
  });

  let customIcon = new icon({
    iconUrl: imageUrl,
  })
  return customIcon;
}

//leave this as a global variable so as to check if there is already routing drawn, if so, remove it
let routingControl = null;

function removeRouteDrawn(map) {
  if (routingControl !== null) {
    map.removeControl(routingControl);

    routingControl = null;
  };
}

//this is an ugly function with many parameters due to lack of leaflet routing machine documentation
function drawRoute(lat, lng, destiLat, destiLng, popUpElement, startingPointIcon, pharmacyIcon, map) {
  removeRouteDrawn(map);
  routingControl = L.Routing.control({
    lineOptions: {
      styles: [
        { color: '#17a2b8', opacity: 1, weight: 5 }
      ]
    },
    waypoints: [
      L.latLng(lat, lng),
      L.latLng(destiLat, destiLng)
    ],
    //https://gis.stackexchange.com/questions/236934/leaflet-routing-control-change-marker-icon
    createMarker: function (i, start, n) {
      let marker_icon = null
      if (i == 0) {
        // This is the first marker, indicating start
        marker_icon = startingPointIcon
      } else if (i == n - 1) {
        //This is the last marker indicating destination
        marker_icon = pharmacyIcon
      }
      let marker = L.marker(start.latLng, {
        draggable: true,
        bounceOnAdd: false,
        bounceOnAddOptions: {
          duration: 1000,
          height: 800,
        },
        icon: marker_icon
      })
      //below addes pop up only to the destination
      if (i == 0) {
        marker.bindPopup("You are here!");
      } else if (i == n - 1) {
        //This is the last marker indicating destination
        marker.bindPopup(popUpElement);
      }
      return marker
    },
  });
  routingControl.addTo(map);

  // it is diffcult to get twoway point to open pop up
  //Path overlays like polylines also have a bindPopup method. Here's a more complicated way to open a popup on a map:
  let pop1 = L.popup()
    .setLatLng([destiLat, destiLng])
    .setContent(popUpElement)
    .openOn(map);

  map.flyTo([lat, lng], 10);
}

function getNearestPharmacyInfo(lat, lng, searchDataArray) {
  let nearbyLatLng = [];
  let minDistance = Infinity;
  for (let el of searchDataArray) {
    let address = el[0];
    let lat2 = Number(el[1]);
    let lng2 = Number(el[2]);
    let pharmacistName = el[3];

    //cal distance(km) between 2 coordinates
    let distance = calDistance(lat, lng, lat2, lng2);

    //get the coordinates of the min-distanced pharmacy
    //time complexity this is taking some time
    if (distance < minDistance) {
      minDistance = distance;
      nearbyLatLng = [];
      nearbyLatLng.push(lat2, lng2);
      nearbyLatLng.push(address);
      nearbyLatLng.push(pharmacistName);
    }
  }
  return nearbyLatLng;
}

//user location setting
const userLocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

//return error message if unable to get user's location
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  alert("Please allow us to access your location to find the pharmacy near you!")
}

function createDirectionBtn(btnValue) {
  return `
          <button class="btn btn-info">
          ${btnValue} <i class="fa-solid fa-diamond-turn-right"></i>
          </button>
          `
}

async function mainMap() {
  async function init() {
    let map = initMap();

    let pharmacyIcon = createCustomMarkerIcon('./images/pharmacy.png')
    let startingPointIcon = createCustomMarkerIcon("./images/start.png");

    window.addEventListener("DOMContentLoaded", async function () {
      let searchDataArray = await extractAddressForSearch();
      let searchResultLayer = L.layerGroup();

      //leave spinner element as a global varibale to be accessed later
      let spinner = document.querySelector("#nearMeSpinner");

      //find the nearby pharmacy
      document.querySelector("#searchNearByBtn")
        .addEventListener("click", function () {
          spinner.classList.add("displaySpinner");

          //get user location 
          function success(pos) {
            let crd = pos.coords;
            let lat = crd.latitude;
            let lng = crd.longitude;
            let nearbyLatLng = getNearestPharmacyInfo(lat, lng, searchDataArray);

            //extract all destination info to be used later
            let destiLat = nearbyLatLng[0];
            let destiLng = nearbyLatLng[1];
            let addressArray = nearbyLatLng[2].split(",");
            let name = addressArray[0];
            let address = addressArray.slice(1);
            let pharmacistName = nearbyLatLng[3];
            let popUpElement = document.createElement("div");
            popUpElement.classList.add("makerPopUp");
            popUpElement.innerHTML = createPopUpContent(name, pharmacistName, address);
            drawRoute(lat, lng, destiLat, destiLng, popUpElement, startingPointIcon, pharmacyIcon, map);
            spinner.classList.remove("displaySpinner");
          }
          navigator.geolocation.getCurrentPosition(success, error, userLocationOptions);
        })

      //search for pharmacy through address
      document
        .querySelector("#searchBtn")
        .addEventListener("click", function (event) {
          event.preventDefault();
          searchResultLayer.clearLayers();
          let searchString = document.querySelector("#searchString").value;

          let validationResult = document.querySelector("#searchAddressValidationResult");
          //data validation for user input
          if (formValidate(searchString)) {
            validationResult.innerHTML = globalValidationResults;
          } else {
            validationResult.innerHTML = "";
            let filteredResult = searchDataArray.filter((el) =>
              el[0].toLowerCase().includes(searchString.toLowerCase())
            );

            //if there is no matched result
            if (filteredResult.length === 0) {
              validationResult.innerHTML = "There is no matched result. Try again!"
            } else {
              let resultDiv = document.querySelector("#result");
              //UI UX: remove border radius
              let searchByAddressBar = document.querySelector("#searchByAddressBar");
              searchByAddressBar.classList.add("borderRadiusNone");
              resultDiv.innerHTML = "";

              for (el of filteredResult) {
                //create marker based on filteredResult;
                let lat = Number(el[1]);
                let lng = Number(el[2]);
                let addressArray = el[0].split(",");
                let name = addressArray[0];
                let address = addressArray.slice(1);
                let pharmacistName = el[3];
                let marker = L.marker([lat, lng], { icon: pharmacyIcon });
                let popUpElement = document.createElement("div");
                popUpElement.classList.add("makerPopUp");
                popUpElement.innerHTML = createPopUpContent(name, pharmacistName, address);

                let directionDivElement = document.createElement("div");

                directionDivElement.innerHTML = createDirectionBtn("direction");
                popUpElement.appendChild(directionDivElement);

                marker.bindPopup(
                  popUpElement
                );
                marker.addTo(searchResultLayer);

                //create search result list and add event listener to each result
                let divElement = document.createElement("div");
                divElement.classList.add("m-3")
                divElement.innerHTML = `
                  <i class="fa-solid fa-magnifying-glass me-1"></i>
                  ${el[0].split(",")[0]}
              `;
                divElement.addEventListener("click", function () {
                  //give border radius to searchbar again when user chose the locaiton
                  searchByAddressBar.classList.remove("borderRadiusNone");
                  resultDiv.innerHTML = "";
                  map.flyTo([lat, lng], 13);
                  marker.openPopup();
                });

                resultDiv.appendChild(divElement);

                //event listener when user click get direction button from pharmacy store
                directionDivElement.addEventListener("click", function () {
                  spinner.classList.add("displaySpinner");
                  //get user location 
                  function success(pos) {
                    let crd = pos.coords;
                    let staringLat = crd.latitude;
                    let startingLng = crd.longitude;
                    drawRoute(staringLat, startingLng, lat, lng, popUpElement, startingPointIcon, pharmacyIcon, map);
                    spinner.classList.remove("displaySpinner");
                  }
                  navigator.geolocation.getCurrentPosition(success, error, userLocationOptions);
                });
              }
            }
          }
        });
      searchResultLayer.addTo(map);
    });
  }
  init();
}

mainMap();

