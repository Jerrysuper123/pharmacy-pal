
//read Includes symptoms, treatment, mode of transmission.
//1. read symptoms
//2. decide kind of drug
//3. whether available in pharmacy

async function readDisease() {
    //not very useful, only return 46 disease type below, symptoms also, not very clear
    // let response = await axios.get("https://disease-info-api.herokuapp.com/diseases.json")

    //below is the wikipea return full page of a disease
    // let response = await axios.get("https://en.wikipedia.org/w/api.php?action=parse&page=cough&prop=text")

    //below return short description of the disease
    let response = await axios.get("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=tuberculosis")
    console.log(response);
}




// async function getDrug() {
//     const OPENFDA_API_KEY = "IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL";
//     // Congrats! Your API Key is:IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL
//     // https://api.fda.gov/drug/event.json?api_key=yourAPIKeyHere&search=...
//     // const FAD_BASE_URL = "https://api.fda.gov/drug/label.json?search=purpose";


//     //a bit bad returns inconistent object, hard to manage
//     let response = await axios.get("https://api.fda.gov/drug/label.json?search=purpose:covid&limit=5");
//     // let response = await axios.get(FAD_BASE_URL);
//     console.log(response.data);
// }

async function getDrug(symptom) {
    const OPENFDA_API_KEY = "IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL";
    // Congrats! Your API Key is:IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL
    // https://api.fda.gov/drug/event.json?api_key=yourAPIKeyHere&search=...
    const DRUGLABEL_BASE_URL = "https://api.fda.gov/drug/label.json";


    //a bit bad returns inconistent object, hard to manage
    // let response = await axios.get("https://api.fda.gov/drug/label.json?search=purpose:covid&limit=5");
    let response = await axios.get(DRUGLABEL_BASE_URL,{
        params:{
            api_key: OPENFDA_API_KEY,
            search: "purpose:"+ symptom,
            limit: 5
        }
    });
    
    // let response = await axios.get(FAD_BASE_URL);
    // console.log(response.data.results);
    return response.data.results;
}