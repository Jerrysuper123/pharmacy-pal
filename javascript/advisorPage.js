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

window.addEventListener("DOMContentLoaded", async function () {
  symptomData = await getSymptomsDataTransformed();
  let diseaseSymptomArray = symptomData[0];
  let symptomSet = symptomData[1];
  // console.log(symptomData);

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

      let diseaseList = document.querySelector("#diseaseList");
      for (let el of diseaseArray) {
        let diseaseElement = document.createElement('div');
        diseaseElement.innerHTML = `${el}`;
        diseaseElement.addEventListener("click", async function () {
          let titleBodyImg = await getTitleBodyImg(el);
          let diseaseDescription = document.querySelector("#diseaseDescription");
          diseaseDescription.innerHTML = "";
          diseaseDescription.innerHTML = `
            <h1 class="text-center">${titleBodyImg[0][0]}</h1>
            <img src=${titleBodyImg[1]} class="diseaseImage" alt=${titleBodyImg[0][0]}/>
            <p>${titleBodyImg[0][1]}</p>
          `;
        })
        diseaseList.appendChild(diseaseElement);
      }
    })
})






//Drug match-disease page
document.querySelector("#searchMatchDrugBtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    document.querySelector("#matchedDrugBG").classList.add("hide");
    let searchDrugString = document.querySelector("#searchDrugString").value;
    // console.log(searchDrugString);
    let results = await getTransformedDrug(searchDrugString);
    console.log(results);
    let drugResultsElement = document.querySelector("#drugResults");
    // clear results when user search again
    drugResultsElement.innerHTML = "";
    let drugDetailsElement = document.querySelector("#drugDetails");
    drugDetailsElement.innerHTML = "";


    //clear details when user search again
    // drugDetailsElement.innerHTML = "";

    //below is not working
    // if(results===){
    //     drugResultsElement.innerHTML = "Could not find a matched drug";
    //     console.log("cannot find a drug")
    // }

    for (let drug of results) {
      let eachDrugElement = document.createElement("div");

      eachDrugElement.classList.add("listItemDesign");
      eachDrugElement.classList.add("shadow-1");
      let drugName = drug.openfda.brand_name[0];
      eachDrugElement.innerHTML = `
      <span class="drugNameTitle">${drugName}</span>
        <i class="expandIcon fa-solid fa-angle-right"></i>`;

      eachDrugElement.addEventListener("click", function (event) {
        // let purpose = drug.openfda.brand_name !==  undefined ? `<h1>${drug.openfda.brand_name[0]}</h1>` : "";



        function addColorScaleToOneElementOnly(elementClass, event){
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

      function clickFirstChild(parentElement) {
        let firstChild = parentElement.firstChild;
        firstChild.classList.add("colorAccentTwoAndScale");
        firstChild.click();
      }

      clickFirstChild(drugResultsElement);

    }

  })


//drug side effects chart
// {x: month, y: total amount}, transform data into this format
document.querySelector("#searchEffectBtn").addEventListener("click", async function (event) {
  //1 function only does 1 function
  // let data = await loadData();
  // let transformed = transformData(data, null, null);
  // updateChart(chart, transformed, "sales");
  event.preventDefault();
  let searchEffectString = document.querySelector("#searchEffectString").value;

  let lineData = await getEffectDataTranformed(searchEffectString);
  let barData = await getEventsTransformed(searchEffectString);
  console.log(barData);
  updateChart(lineChart, lineData, `${searchEffectString} adverse events reported`);
  updateChart(barChart, barData, `advese events reported`);


  // // document.querySelector("#search-btn").addEventListener("click", function () {
  // //   let country = document.querySelector("#search-terms").value;
  // //   let transformed = transformData(data, country, null);
  // //   updateChart(chart, transformed, "sales");
  // });
});

function updateChart(chart, newSeries, newSeriesName) {
  chart.updateSeries([
    {
      name: newSeriesName,
      data: newSeries,
    },
  ]);
}

const options = {
  chart: {
    type: "line",
    height: "100%",
  },
  // not working now
  title: {
    text: "Adverse events reported over time",
    align: 'left',
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      fontFamily: undefined,
      color: '#263238'
    },
  },
  series: [],
  noData: {
    text: "loading",
  },
};

const lineChart = new ApexCharts(document.querySelector("#lineChart"), options);
lineChart.render();

const barOptions = {
  chart: {
    type: "bar",
    height: "100%",
  },
  // not working now
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


