async function extractAddressForSearch() {
  let response = await axios.get("./localData/pharmacyLocation.geojson");
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
    let pharmacyName = columns[6].innerHTML + " ,";
    let buildingName = !columns[1].innerHTML? "" : columns[1].innerHTML + " ,";
    let blkNo = !columns[5].innerHTML? "": "blk" + columns[5].innerHTML + " ,";
    let roadName = columns[4].innerHTML+ " ,";
    let levelNo = !columns[3].innerHTML? "" : "#" + columns[3].innerHTML;
    let unitNo = !columns[2].innerHTML? "" : "-" + columns[2].innerHTML+ " ,";
    let postalCode = "Singapore " + columns[0].innerHTML;
    let pharmacistName = "";

    if (pharmacistNames[columns[0].innerHTML]) {
      pharmacistName = pharmacistNames[columns[0].innerHTML];
    } else {
      pharmacistName = "N.A.";
    }
    //[["address", lat,lng, name],[...]]
    let oneAddress = [
      `${pharmacyName}${buildingName}${blkNo}${roadName}${levelNo}${unitNo}${postalCode}`,
      lat,
      lng,
      pharmacistName,
    ];

    pharmacySearchArrayData.push(oneAddress);
  }
  return pharmacySearchArrayData;
}
