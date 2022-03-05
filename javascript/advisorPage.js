//symptom checker page
//load the data first [disease-symptom object dataset, symptom set]

//credit: https://www.geeksforgeeks.org/find-whether-an-array-is-subset-of-another-array-set-1/
// check if an array is subset of another
/* Return true if arr2[] is a subset of arr1[] */
function isSubSet(arr1, arr2, m = arr1.length, n = arr2.length) {
  let s = new Set();
  for (let i = 0; i < m; i++) {
    s.add(arr1[i]);
  }
  let p = s.size;
  for (let i = 0; i < n; i++) {
    s.add(arr2[i]);
  }

  if (s.size == p) {
    return true;
  }
  else {
    return false;
  }
}

let symptomData = [];
let symptomSearchResults = document.querySelector("#symptomSearchResults");

//landing page get my direction
document.querySelector("#landPageBtn")
  .addEventListener("click", function () {
    document.querySelector("#appBrief").classList.add("hideLeft");
    document.querySelector("#searchNearByBtn").click();
  })

window.addEventListener("DOMContentLoaded", async function () {
  symptomData = await getSymptomsDataTransformed();
  let diseaseSymptomArray = symptomData[0];
  let symptomSet = symptomData[1];
  // console.log(symptomData);

  //fill in the chart with sample vaccine data
  document.querySelector("#searchEffectBtn").click();

  document.querySelector("#searchSymptomInput")
    .addEventListener("click", function () {
      let searchInput = document.querySelector("#searchSymptomBtn");
      //this removes border radius when user click into the input
      searchInput.classList.add("borderRadiusNone");
    })

  document.querySelector("#searchSymptomInput")
    .addEventListener("keypress", function () {

      let searchSymptomString = document.querySelector("#searchSymptomInput").value;
      // console.log(searchSymptomString);

      let filterList = symptomSet.filter(el => el.includes(searchSymptomString));
      console.log(filterList);

      symptomSearchResults.innerHTML = "";

      for (let el of filterList) {
        //create one element [symptom Add]
        let oneSymptomElement = document.createElement("div");
        oneSymptomElement.classList.add("d-flex");
        oneSymptomElement.classList.add("p-3");
        oneSymptomElement.innerHTML = el !== undefined ? `${el}<span class="ms-auto p-1 bg-info text-light">ADD</span>` : "";

        oneSymptomElement.addEventListener("click", function () {
          //remove the background in the symptom list
          let symptomBG = document.querySelector("#symptomBG");
          symptomBG.innerHTML = "";

          //this addd border radius when user selected symptom
          let searchInput = document.querySelector("#searchSymptomBtn");
          searchInput.classList.remove("borderRadiusNone");

          //this shows the diagnose button when user clicked added symptom;
          document.querySelector("#diagnoseBtn").classList.remove("hideDiagnoseBtn");

          //below add symptoms to the symtomAdded basket
          symptomSearchResults.innerHTML = "";
          let symptomAdded = document.querySelector("#symptomAdded");
          let element = document.createElement("div");
          element.classList.add("oneSymptomStyle");
          element.innerHTML = `
                <span class="symptomSelected">${el}</span> 
                <i class="fa-solid fa-trash"></i>
              `;

          element.addEventListener("click", function () {
            element.classList.remove("oneSymptomStyle");
            element.innerHTML = "";
          });
          symptomAdded.appendChild(element);
        })

        symptomSearchResults.appendChild(oneSymptomElement)
      }
    })

  document.querySelector("#diagnoseBtn")
    .addEventListener("click", function () {
      let symptomElements = document.querySelectorAll(".symptomSelected");
      // console.log(symptomElements);
      let symptomArray = [];
      for (let el of symptomElements) {
        symptomArray.push(el.innerHTML);
      }

      let validationSymptomEle = document.querySelector("#symptomsValidationResult");
      //validation on if uses have selected symptoms
      if (symptomArray.length === 0) {
        validationSymptomEle.innerHTML = "You have not selected any symptoms!"
      } else {
        validationSymptomEle.innerHTML = "";
        // console.log(symptomArray);
        //check if symptomArray is a subset of diseaseSymptomArray
        //find only 3 matched item for time optimization [{disease: symptom}]
        let arrayResult = [];
        let count = 0;
        for (let el of diseaseSymptomArray) {
          let arr1 = Object.values(el)[0];
          let arr2 = symptomArray;
          if (isSubSet(arr1, arr2)) {
            if (count === 3) break;
            arrayResult.push(el);
            count++;
          }
        }

        // console.log(arrayResult);
        // extract key and put it into an array
        let diseaseArray = [];
        for (let el of arrayResult) {
          let diseaseName = Object.keys(el)[0];
          diseaseArray.push(diseaseName);
        }

        //if there is no disease matched, let user know
        if (diseaseArray.length === 0) {
          validationSymptomEle.innerHTML = "You symptoms did not match any conditions in our database. Choose your symptoms again!"
        } else {
          validationSymptomEle.innerHTML = "";

          let diseaseList = document.querySelector("#diseaseList");
          diseaseList.innerHTML = "";

          //adding downarrowicon when user clicked diagnose
          let downArrowIcon = document.querySelector("#downArrowIcon");
          downArrowIcon.classList.remove("d-none");

          for (let el of diseaseArray) {
            let diseaseElement = document.createElement('div');
            diseaseElement.innerHTML = returnListItemString(el);

            diseaseElement.classList.add("listItemDesign");


            //retrieve the condition title, text and image
            diseaseElement.addEventListener("click", async function (event) {
              addColorScaleToOneElementOnly("listItemDesign", event);

              let titleBodyImg = await getTitleBodyImg(el);
              let diseaseDescription = document.querySelector("#diseaseDescription");
              diseaseDescription.innerHTML = "";
              diseaseDescription.innerHTML = `
            <h1 class="text-center drugDetailHeader">${titleBodyImg[0][0]}</h1>
            <img src=${titleBodyImg[1]} class="diseaseImage" alt=${titleBodyImg[0][0]}/>
            <p>${titleBodyImg[0][1]}</p>
          `;
            })
            diseaseList.appendChild(diseaseElement);
          }

          //click the first condition to show its details
          clickFirstChild(diseaseList);

        }

      }


    })


})

//create list item html string for inner html
function returnListItemString(elValue) {
  let stringHTML = `
  <span class="itemItem">${elValue}</span>
    <i class="expandIcon fa-solid fa-angle-right"></i>`;
  return stringHTML;
}

//when program load will alway click the first child of the a parent element
function clickFirstChild(parentElement) {
  let firstChild = parentElement.firstChild;
  firstChild.classList.add("colorAccentTwoAndScale");
  firstChild.click();
}


//when use click one item, change its color and greyout the rest
//1 arg is the item class, 2 arg is the event (being clicked);
function addColorScaleToOneElementOnly(elementClass, event) {
  let currentElement = event.target;
  elementClassQuerySelector = `.${elementClass}`;
  let items = document.querySelectorAll(elementClassQuerySelector);
  for (let el of items) {
    el.classList.remove("colorAccentTwoAndScale");
  }
  if (currentElement.classList[0] === elementClass) {
    currentElement.classList.add("colorAccentTwoAndScale")
  } else {
    let parentElement = currentElement.parentElement;
    if (parentElement.classList[0] === elementClass) {
      parentElement.classList.add("colorAccentTwoAndScale");
    }
  }
}



//Drug match-disease page
document.querySelector("#searchMatchDrugBtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    let drugResultsElement = document.querySelector("#drugResults");
    // clear results when user search again
    drugResultsElement.innerHTML = "";

    let drugDetailsElement = document.querySelector("#drugDetails");
    drugDetailsElement.innerHTML = "";

    let searchDrugString = document.querySelector("#searchDrugString").value;
    let userErrorNote = document.querySelector("#diseaseMatchDrugValidationResult");
    //input validation
    if (formValidate(searchDrugString)) {
      userErrorNote.innerHTML = globalValidationResults;
    } else {

      let results = await getTransformedDrug(searchDrugString);

      // let user know if there is no matched results
      if (results.length === 0) {
        userErrorNote.innerHTML = `You condition did not match anything in our database.
        Try a different name for the same condition.
        `;
      } else {
        document.querySelector("#matchedDrugBG").classList.add("hide");

        for (let drug of results) {
          let eachDrugElement = document.createElement("div");

          eachDrugElement.classList.add("listItemDesign");
          eachDrugElement.classList.add("shadow-1");
          let drugName = drug.openfda.brand_name[0];
          eachDrugElement.innerHTML = returnListItemString(drugName);

          eachDrugElement.addEventListener("click", function (event) {
            // let purpose = drug.openfda.brand_name !==  undefined ? `<h1>${drug.openfda.brand_name[0]}</h1>` : "";

            addColorScaleToOneElementOnly("listItemDesign", event);

            let purpose = drug.purpose !== undefined ? `<p class="text-center">${drug.purpose[0]}</p>` : "";
            let detailedpurpose = drug.indications_and_usage !== undefined ? `<h2>Drug use</h2><p>${drug.indications_and_usage[0]}</p>` : "";
            let admin = drug.dosage_and_administration !== undefined ? `<h2>Admin</h2><p>${drug.dosage_and_administration[0]}</p>` : "";
            let whenUse = drug.when_using !== undefined ? `<h2>How to use</h2><p>${drug.when_using[0]}</p>` : "";
            let stopUse = drug.stop_use !== undefined ? `<p>${drug.stop_use[0]}</p>` : "";
            let activeIngredient = drug.active_ingredient !== undefined ? ` <h2>Ingredient</h2><p>${drug.active_ingredient[0]}</p>` : "";
            drugDetailsElement.innerHTML = `
                      <h1 class="text-center drugDetailHeader">${drugName}</h1>
                      ${purpose}
                    ${detailedpurpose}
                    ${admin}
                    ${whenUse}
                      ${stopUse}
                      ${activeIngredient}
            `;
          })

          drugResultsElement.appendChild(eachDrugElement);
          //highlight the first child

          clickFirstChild(drugResultsElement);
        }
      }

    }

  })

let lineData = [];
let barData = [];

//drug side effects page
document.querySelector("#searchEffectBtn").addEventListener("click", async function (event) {
  event.preventDefault();
  let searchEffectString = document.querySelector("#searchEffectString").value;
  let sideEffectUserNote = document.querySelector("#drugSideEffectsValidationResult");
  sideEffectUserNote.innerHTML = "";

  /*first load vaccine dummy data, the default is an empty string, so show no error message */
  if (searchEffectString === "" && (lineData.length === 0 || barData.length === 0)) {
    searchEffectString = "BioNTech, Pfizer vaccine";

    /*user input empty string for search, output error message */
  } else if (searchEffectString === "" && (lineData.length !== 0 || barData.length !== 0)) {
    if (formValidate(searchEffectString)) {
      sideEffectUserNote.innerHTML = `${globalValidationResults} We have defaulted the search string to "BioNTech, Pfizer vaccine"`;
    }
  }

  //added parallel loading for both charts
  loader1 = getEffectDataTranformed(searchEffectString);
  loaded2 = getEventsTransformed(searchEffectString);

  lineData = await loader1;
  barData = await loaded2;

  //no matched results, output to user
  if (lineData.length === 0 || barData === 0) {
    sideEffectUserNote.innerHTML = `
      There are no matched results in our database. Try a different name for the same drug!
    `;
  } else {
    updateChart(lineChart, lineData, `${searchEffectString} adverse events reported`);
    updateChart(barChart, barData, `adverse events reported`);

    document.querySelector("#lineChartTitle").innerHTML = `${searchEffectString} trend over time`;
    document.querySelector("#barChartTitle").innerHTML = `${searchEffectString} key side-effects`;
  }
});

function updateChart(chart, newSeries, newSeriesName) {
  chart.updateSeries([
    {
      name: newSeriesName,
      data: newSeries,
    },
  ]);
}

/*Line chart */
const options = {
  chart: {
    type: "line",
    height: "100%",
  },

  title: {
    text: "Adverse events reported over time"
  },
  series: [],
  noData: {
    text: "loading",
  },
};

const lineChart = new ApexCharts(document.querySelector("#lineChart"), options);
lineChart.render();

/*bar chart */
const barOptions = {
  chart: {
    type: "bar",
    height: "100%",
  },

  title: {
    text: "Top 5 adverse events reported",
  },
  series: [],
  noData: {
    text: "loading",
  },
};

const barChart = new ApexCharts(document.querySelector("#barChart"), barOptions);
barChart.render();


