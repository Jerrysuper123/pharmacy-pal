

document.querySelector("#searchMatchDrugBtn")
    .addEventListener("click", async function (event) {
        event.preventDefault();
        let searchDrugString = document.querySelector("#searchDrugString").value;
        // console.log(searchDrugString);
        let results = await getTransformedDrug(searchDrugString);
        // console.log(results);
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
            eachDrugElement.innerHTML = `${drug.openfda.brand_name}<span class="ms-auto"><i class="fa-solid fa-angle-right"></i></span>`;
            eachDrugElement.addEventListener("click", function () {
                console.log("click brand name");
 

                let purpose = drug.indications_and_usage !== undefined ? `<li>${drug.indications_and_usage[0]}</li>` : "";
                let admin = drug.dosage_and_administration !== undefined ? `<li>${drug.dosage_and_administration[0]}</li>` : "";
                let whenUse = drug.when_using !== undefined ? `<li>${drug.when_using[0]}</li>` : "";
                let stopUse = drug.stop_use !== undefined ? `<li>${drug.stop_use[0]}</li>` : "";
                let activeIngredient = drug.active_ingredient !== undefined ? `<li>${drug.active_ingredient[0]}</li>` : "";
                drugDetailsElement.innerHTML = `
                    <ul>
                   ${purpose}
                 ${admin}
                ${whenUse}
            ${stopUse}
                    ${activeIngredient}
                    </ul>`;
            })

            drugResultsElement.appendChild(eachDrugElement);
        }

    })