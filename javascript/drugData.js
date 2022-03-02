// //read and display drug data
// document
//   .querySelector("#searchDrugBtn")
//   .addEventListener("click", async function () {
//     let queryString = document.querySelector("#queryDrugNameInput").value;
//     //   console.log(queryString);
//     let drugArray = await readDrug(queryString);
//     let drugContentElement = document.querySelector("#drugContent");
//     drugContentElement.innerHTML = "";

//     //get full list of act codes with explanation
//     let atcFullList = await mergeATCData();

//     for (let el of drugArray) {
//       let levelOne = el.atc_code.slice(0, 1).toLowerCase();
//       let levelTwo = el.atc_code.slice(0, 3).toLowerCase();
//       levelOneUse = atcFullList[levelOne];
//       levelTwoUse = atcFullList[levelTwo];

//       let divElement = document.createElement("div");
//       let content = `
//         <h1>${el.product_name}</h1>
//         <h2>${el.forensic_classification}</h2>
//         <p>The drug is manufactured by ${el.manufacturer} in ${
//         el.country_of_manufacturer
//       }</p>
//         <p>The drug is available in the form of ${el.dosage_form.toLowerCase()} and for ${el.route_of_administration.toLowerCase()} use only</p>
//         <p>active ingredients: ${el.active_ingredients}</p>
//         <h3>Drug usage:</h3>
//         <p>${levelOneUse}</p>
//         <p>${levelTwoUse}</p>
//       `;
//       divElement.innerHTML = content;
//       drugContentElement.appendChild(divElement);
//     }
//   });

// async function readDrug(queryString) {
//   let BASE_URL = "https://data.gov.sg/api/action/datastore_search";

//   var data = {
//     resource_id: "3ee20559-372d-42f0-bde9-245e21f7f39b", // the resource id
//     limit: 5, // get 5 results
//     q: queryString,
//   };

//   let response = await axios.get(BASE_URL, {
//     params: data,
//   });
//   console.log(response.data.result.records);
//   return response.data.result.records;
// }
