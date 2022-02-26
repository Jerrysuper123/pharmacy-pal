
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
    // https://en.wikipedia.org/w/api.php?format=json&action=query&page=cough
    //wikipedia api not working
    // let response = await axios.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=disease`)
    console.log(response.query.pages[8072].extract);
}

//credit: https://open.fda.gov/apis/drug/event/explore-the-api-with-an-interactive-chart/
//below shows the most popular API from US FDA
//credit:https://open.fda.gov/about/statistics/
//below gets the side effects incidents reported from 2014 to current date
async function getAdverseEventOverTime(drugName) {
    const DRUGEVENT_BASE_URL = "https://api.fda.gov/drug/event.json"; 
    let response = await axios.get(`https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20220225])+AND+${drugName}&count=receivedate`);
    
    return response.data.results;
}


//below gets the side effects type reported from 2014 to current date
async function getAdverseEventType(drugName) {
    const DRUGEVENT_BASE_URL = "https://api.fda.gov/drug/event.json"; 
    let response = await axios.get(`https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20220226])+AND+${drugName}&count=patient.reaction.reactionmeddrapt.exact`);
    return response.data.results;
}

//return drug name by users' symptoms and disease
async function getDrug(symptom) {
    const OPENFDA_API_KEY = "IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL";
    const DRUGLABEL_BASE_URL = "https://api.fda.gov/drug/label.json";

    let response = await axios.get(DRUGLABEL_BASE_URL,{
        params:{
            api_key: OPENFDA_API_KEY,
            search: "purpose:"+ symptom,
            limit: 5
        }
    });

    return response.data.results;
}