async function readPharmacyLocationJson(map) {
  let response = await axios.get("../localData/pharmacyLocation.geojson");
  let pharmacistNames = await extractPharmacistData();

  let pharmacySearchArrayData = [];

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
    let pharmacistName = "";

    let oneAddress = [
      `
    ${pharmacyName},
    ${buildingName},
    blk ${blkNo},
    ${roadName},
    #${levelNo}-${unitNo},
    Singapore ${postalCode},
    `,
    ];

    pharmacySearchArrayData.push(oneAddress);

    // if there is pharmacist name data, add to the pop up;
    if (pharmacistNames[postalCode]) {
      pharmacistName = pharmacistNames[postalCode];
    } else {
      pharmacistName = "Pharmacist name currently unavailable";
    }

    marker.bindPopup(`
      <ul>
        <li>${pharmacyName}</li>
        <li>${buildingName}</li>
        <li>Blk ${blkNo} ${roadName} #${levelNo}-${unitNo}</li>
        <li>Singapore ${postalCode}</li>
        <li>${pharmacistName}</li>
      </ul>
      `);

    marker.addTo(markerClusterGroup);
  }
  // return columns;
  markerClusterGroup.addTo(map);
  return pharmacySearchArrayData;
}

async function extractAddressForSearch() {
  let response = await axios.get("../localData/pharmacyLocation.geojson");
  let pharmacistNames = await extractPharmacistData();

  let pharmacySearchArrayData = [];

  let locationArray = response.data.features;

  // return locationArray;
  for (let el of locationArray) {
    let description = el.properties.Description;

    //create marker description
    let dummyDiv = document.createElement("div");
    dummyDiv.innerHTML = description;
    //extract all table data from geoJson data
    let columns = dummyDiv.querySelectorAll("td");

    let lat = Number(el.geometry.coordinates[1]);
    let lng = Number(el.geometry.coordinates[0]);
    let pharmacyName = columns[6].innerHTML;
    let buildingName = columns[1].innerHTML;
    let blkNo = columns[5].innerHTML;
    let roadName = columns[4].innerHTML;
    let levelNo = columns[3].innerHTML;
    let unitNo = columns[2].innerHTML;
    let postalCode = columns[0].innerHTML;
    let pharmacistName = "";

    if (pharmacistNames[postalCode]) {
      pharmacistName = pharmacistNames[postalCode];
    } else {
      pharmacistName = "Pharmacist name currently unavailable";
    }

    let oneAddress = [
      `${pharmacyName}, ${buildingName}, blk ${blkNo}, ${roadName}, #${levelNo}-${unitNo}, Singapore ${postalCode},`.toLowerCase(),
      lat,
      lng,
      pharmacistName,
    ];

    pharmacySearchArrayData.push(oneAddress);
  }
  return pharmacySearchArrayData;
}

// let searchDatabase = await extractAddressForSearch();
