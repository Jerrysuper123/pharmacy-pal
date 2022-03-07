// credit: https://www.geeksforgeeks.org/find-whether-an-array-is-subset-of-another-array-set-1/
// check if an array is subset of another, return true if arr2 is a subset of arr1
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
};

function getDiseaseDescriptionHTMLString(title, bodyText, image) {
  return `
        <h1 class="text-center drugDetailHeader">${title}</h1>
        <img src=${image} class="diseaseImage" alt=${title}/>
        <p class="bodyDetailHeader">${bodyText}</p>
                  `;
};

//create list item html string for innerHtml, used at symptom checker and drug match disease page
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


//create an array for values of class elements selected
function createArrayForSelectedItems(className) {
  let elementsSelected = document.querySelectorAll(className);
  let resultsArray = [];
  for (let el of elementsSelected) {
    resultsArray.push(el.innerHTML);
  }
  return resultsArray;
}

function getMatchedConditions(diseaseSymptomArray, symptomArray) {
  let arrayResult = [];
  let count = 0;
  for (let el of diseaseSymptomArray) {
    let arr1 = Object.values(el)[0];
    let arr2 = symptomArray;
    //check if symptomArray is a subset of diseaseSymptomArray
    if (isSubSet(arr1, arr2)) {
      //find max 3 matched items for time complexity optimization, arryResult=[{disease: symptom},{disease: symptom}...]
      if (count === 3) break;
      arrayResult.push(el);
      count++;
    }
  }
  return arrayResult;
}

/**event listener starts here**/
async function mainAdvisorPage() {
  window.addEventListener("DOMContentLoaded", async function () {
    //fill in the charts with sample vaccine data
    document.querySelector("#searchEffectBtn").click();

    /*Landing page - for users to hide the page or click get direction to nearby pharmacy */
    document.querySelector("#landPageBtn")
      .addEventListener("click", function () {
        document.querySelector("#appBrief").classList.add("hideLeft");
        document.querySelector("#searchNearByBtn").click();
      })

    /*symptom checker page*/
    //load the data first into [disease-symptom object dataset, symptom set], to be used later
    let symptomData = [];
    let symptomSearchResults = document.querySelector("#symptomSearchResults");

    symptomData = await getSymptomsDataTransformed();
    let diseaseSymptomArray = symptomData[0];
    let symptomSet = symptomData[1];

    //when user started typing, change the border raidus of the input element
    document.querySelector("#searchSymptomInput")
      .addEventListener("click", function () {
        let searchInput = document.querySelector("#searchSymptomBtn");
        searchInput.classList.add("borderRadiusNone");
      })

    //for user to search, find, add symptoms to the symptom list
    document.querySelector("#searchSymptomInput")
      .addEventListener("keypress", function () {
        let searchSymptomString = document.querySelector("#searchSymptomInput").value;
        let filterList = symptomSet.filter(el => el.includes(searchSymptomString));
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

            //remove border radius of the input element when user added symptom
            let searchInput = document.querySelector("#searchSymptomBtn");
            searchInput.classList.remove("borderRadiusNone");

            //show the diagnose button when user added symptom;
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

    //diagnose user's conditions when user clicked the diganose button
    document.querySelector("#diagnoseBtn")
      .addEventListener("click", function () {

        let symptomArray = createArrayForSelectedItems(".symptomSelected");

        let validationSymptomEle = document.querySelector("#symptomsValidationResult");
        //check if users have selected any symptoms
        if (symptomArray.length === 0) {
          validationSymptomEle.innerHTML = "You have not selected any symptoms!"
        } else {
          validationSymptomEle.innerHTML = "";

          //Search for matched conditions to user's symptoms
          let arrayResult = getMatchedConditions(diseaseSymptomArray, symptomArray);


          // extract disease key and put it into an array
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

            //UI UX: adding down arrow icon when user clicked the diagnose button
            let downArrowIcon = document.querySelector("#downArrowIcon");
            downArrowIcon.classList.remove("d-none");

            //search for image and description of matched conditions/diease, to be displayed later
            for (let el of diseaseArray) {
              let diseaseElement = document.createElement('div');
              diseaseElement.innerHTML = returnListItemString(el);
              diseaseElement.classList.add("listItemDesign");

              //retrieve the disease title, body text and image
              diseaseElement.addEventListener("click", async function (event) {
                addColorScaleToOneElementOnly("listItemDesign", event);
                let diseaseDescription = document.querySelector("#diseaseDescription");
                diseaseDescription.innerHTML = "";
                //add spinner for side effects
                let spinner = document.querySelector("#diseaseResultLoader");
                spinner.classList.add("displaySpinner");
                let titleBodyImg = await getTitleBodyImg(el);
                spinner.classList.remove("displaySpinner");

                diseaseDescription.innerHTML = "";
                let diseaseTitle = titleBodyImg[0][0];
                let diseaseBodyText = titleBodyImg[0][1];
                let diseaseImage = titleBodyImg[1];
                diseaseDescription.innerHTML = getDiseaseDescriptionHTMLString(diseaseTitle, diseaseBodyText, diseaseImage);
              })
              diseaseList.appendChild(diseaseElement);
            }
            //click the first disease to show its details to users
            clickFirstChild(diseaseList);
          }
        }
      })
  })

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
                      <div class="bodyDetailHeader">
                       ${detailedpurpose}
                    ${admin}
                    ${whenUse}
                      ${stopUse}
                      ${activeIngredient}
                      </div>
                   
                   
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
    yaxis: {
      show: false
    },
    fill: {
      type: 'gradient',
      // colors: ['#2E93fA']
    },
    grid: {
      show: false
    },
    dataLabels: {
      enabled: true,
    },
    colors: ['#ab5e69'],
    title: {
      text: "Past 5 year events reported"
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
    fill: {
      type: 'gradient',
    },
    grid: {
      show: false
    },

    colors: ['#ab5e69'],
    plotOptions: {
      bar: {
        horizontal: true
      }
    },

    title: {
      text: "Top 5 events reported",
    },
    series: [],
    noData: {
      text: "loading",
    },
  };

  const barChart = new ApexCharts(document.querySelector("#barChart"), barOptions);
  barChart.render();
}

mainAdvisorPage();



