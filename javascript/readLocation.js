async function readPharmacyLocationJson(map) {
  let response = await axios.get("../localData/pharmacyLocation.geojson");

  let locationArray = response.data.features;
  let markerClusterGroup = L.markerClusterGroup();

  // return locationArray;
  for (let el of locationArray) {
    let lat = Number(el.geometry.coordinates[1]);
    let lng = Number(el.geometry.coordinates[0]);
    let description = el.properties.Description;
    let marker = L.marker([lat, lng]);

    //create marker description
    let dummyDiv = document.createElement("div");
    dummyDiv.innerHTML = description;
    //extract all table data from geoJson data
    let columns = dummyDiv.querySelectorAll("td");

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

    marker.addTo(markerClusterGroup);
  }
  // return columns;
  markerClusterGroup.addTo(map);
}
