async function readPharmacist() {
  // government no longer supports below API
  let BASE_URL = "https://data.gov.sg/api/action/datastore_search";
  var data = {
    resource_id: "16db7800-d81e-4d0d-9d59-936f2c10d668", // the resource id
    limit: 300,
  };

  let response;
  try{
    response = await axios.get(BASE_URL, {
    params: data,
  });
    return response.data.result.records;
  }catch(error){
    console.log(error);
  }
}

function transformPharmacistData(rawData) {
  //transform pharmacy_address to postal code only
  //{"23542":"name", }
  let transformedData = {};
  for (let el of rawData) {
    let address = el.pharmacy_address;
    let postalCode = extractPostCode(address);
    transformedData[postalCode] = el["pharmacist-in-charge"];
  }
  return transformedData;
}

function extractPostCode(address) {
  let index = address.indexOf("(");
  let postalCode = address.slice(index + 1, index + 7);
  return postalCode;
}

async function extractPharmacistData() {
  let rawData = await readPharmacist();
  let transformedData = transformPharmacistData(rawData);
  return transformedData;
}
