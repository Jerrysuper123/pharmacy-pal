//symptom checker page
//load the data first [disease-symptom object dataset, symptom set]
window.addEventListener("DOMContentLoaded",async function(){
  let symptomData = await getSymptomsDataTransformed();
  console.log(symptomData);

})

document.querySelector("#searchSymptomInput")
        .addEventListener("change", function(){
          console.log(symptomData)
        })

//Drug match-disease page
document.querySelector("#searchMatchDrugBtn")
    .addEventListener("click", async function (event) {
        event.preventDefault();
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
        drugDetailsElement.innerHTML = `<p>Drugs that match the disease</p>`;
       
        for (let drug of results) {
            let eachDrugElement = document.createElement("div");
            
            eachDrugElement.classList.add("drugList");
            eachDrugElement.classList.add("shadow-1");
            let drugName = drug.openfda.brand_name[0];
            eachDrugElement.innerHTML = `<span>${drugName}</span><span class="expandIcon"><i class="fa-solid fa-angle-right"></i></span>`;
            eachDrugElement.addEventListener("click", function () {
                console.log("click brand name");
 
                
                // let purpose = drug.openfda.brand_name !==  undefined ? `<h1>${drug.openfda.brand_name[0]}</h1>` : "";
                let purpose = drug.purpose !==  undefined ? `<p>${drug.purpose[0]}</p>` : "";
                let detailedpurpose = drug.indications_and_usage !== undefined ? `<p>${drug.indications_and_usage[0]}</p>` : "";
                let admin = drug.dosage_and_administration !== undefined ? `<p>${drug.dosage_and_administration[0]}</p>` : "";
                let whenUse = drug.when_using !== undefined ? `<p>${drug.when_using[0]}</p>` : "";
                let stopUse = drug.stop_use !== undefined ? `<p>${drug.stop_use[0]}</p>` : "";
                let activeIngredient = drug.active_ingredient !== undefined ? `<p>${drug.active_ingredient[0]}</p>` : "";
                drugDetailsElement.innerHTML = `
                    <h1>${drugName}</h1>
                    ${purpose}
                    <h2>Drug use</h2>
                   ${detailedpurpose}
                   <h2>Admin</h2>
                 ${admin}
                 <h2>How to use</h2>
                ${whenUse}
            ${stopUse}
            <h2>Ingredient</h2>
                    ${activeIngredient}
            `;
            })

            drugResultsElement.appendChild(eachDrugElement);
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
    title:{
        text: "Adverse events reported over time",
        align: 'left',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '14px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
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
    title:{
        text: "Top 5 adverse events reported",
    },
    series: [],
    noData: {
      text: "loading",
    },
  };
  
  const barChart = new ApexCharts(document.querySelector("#barChart"), barOptions);
  barChart.render();


