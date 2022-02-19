async function readPharmacist() {
  let BASE_URL = "https://data.gov.sg/api/action/datastore_search";

  var data = {
    resource_id: "16db7800-d81e-4d0d-9d59-936f2c10d668", // the resource id
  };

  let response = await axios.get(BASE_URL, {
    params: data,
  });
  //   console.log(response.data.result.records);
  return response.data.result.records;
}

function transformPharmacistData(rawData) {
  //transform pharmacy_address to postal code only
  for (let el of rawData) {
    let address = el.pharmacy_address;
    let postalCode = extractPostCode(address);
    el.postalCode = postalCode;
  }
  //   console.log(rawData);
  return rawData;
}

function extractPostCode(address) {
  let index = address.indexOf("(");
  let postalCode = address.slice(index + 1, index + 7);
  return postalCode;
}
