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

    window.addEventListener("DOMContentLoaded", async function () {
      // let addressesForSearch = await extractAddressForSearch();
      await readPharmacyLocationJson(map);
      let searchData = await extractAddressForSearch();

      //this has to go into readLocation.js so that marker could be clicked too
      document
        .querySelector("#searchBtn")
        .addEventListener("click", function () {
          // console.log("search btn");
          let searchString = document.querySelector("#searchString").value;
          // // console.log(searchString);
          let filteredResult = searchData.filter((el) =>
            el[0].includes(searchString.toLowerCase())
          );

          let resultDiv = document.querySelector("#result");
          resultDiv.innerHTML = "";
          for (el of filteredResult) {
            let divElement = document.createElement("div");
            divElement.innerHTML = el[0].split(",")[0];
            let lat = Number(el[1]);
            let lng = Number(el[2]);
            divElement.addEventListener("click", function () {
              map.flyTo([lat, lng], 15);
              // need to access markers to open it up
            });

            resultDiv.appendChild(divElement);
          }
        });
    });
  }
  init();
}

main();
// let addressesForSearch = await extractAddressForSearch();
