document
  .querySelector("#searchDrugBtn")
  .addEventListener("click", async function () {
    let queryString = document.querySelector("#queryDrugNameInput").value;
    //   console.log(queryString);
    let drugArray = await readDrug(queryString);
    let drugContentElement = document.querySelector("#drugContent");
    drugContentElement.innerHTML = "";
    //transform data;
    for (let el of drugArray) {
      let divElement = document.createElement("div");
      let content = `
        <h1>${el.product_name}</h1>
        <h2>${el.forensic_classification}</h2>
        <p>The drug is manufactured by ${el.manufacturer} in ${
        el.country_of_manufacturer
      }</p>
        <p>The drug is available in the form of ${el.dosage_form.toLowerCase()} and ${el.route_of_administration.toLowerCase()} consumption</p>
        <p>active ingredients: ${el.active_ingredients}</p>
        <p>ATC Code: ${el.atc_code}</p>
      `;
      divElement.innerHTML = content;
      drugContentElement.appendChild(divElement);
    }
  });

async function readDrug(queryString) {
  let BASE_URL = "https://data.gov.sg/api/action/datastore_search";

  var data = {
    resource_id: "3ee20559-372d-42f0-bde9-245e21f7f39b", // the resource id
    limit: 5, // get 5 results
    q: queryString,
  };

  let response = await axios.get(BASE_URL, {
    params: data,
  });
  console.log(response.data.result.records);
  return response.data.result.records;
}
