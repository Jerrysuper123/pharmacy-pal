
//read Includes symptoms, treatment, mode of transmission.
//1. read symptoms
//2. decide kind of drug
//3. whether available in pharmacy

async function readSymptomsData() {
    let response = await axios.get("../localData/diseaseAndSymptoms.csv");
    //   console.log(response.data.split("\r\n"));
    return response.data.split("\r\n");
    // return response.data.result.records;
  }

function symptomsDataTransform(results){
    //remove column headers of csv
    let arrayData = [];
    let oneArray = [];
    let finalResults = [];
    //create a set to contain unique symptoms
    let symptomsSet = new Set();
    results.shift();
  
    for (let el of results){
        //split one string into elements of an array
        arrayData.push(el.split(","));
    }

    //trim and remove empty spaces
    for(let el of arrayData){
        oneArray = [];
        for(let string of el){
            let oneString = string.trim();
            if(oneString!==""){
                oneArray.push(oneString);
            }
        }
        finalResults.push(oneArray);
    }

    //making final objects
    //[{disease: symptoms..},{...}]
    let objArray = [];
    for(el of finalResults){
        let diseaseName = el[0];
        // console.log(diseaseName)
        let symptoms = el.slice(1);

        //create symptom for searching
        for(oneSymptom of symptoms){
            symptomsSet.add(oneSymptom);
        }
        let obj = {};
        obj[diseaseName] = symptoms;
        // console.log(obj);
        objArray.push(obj);
    }
    
    // convert set back to array
    return [objArray,Array.from(symptomsSet)];
}

async function getSymptomsDataTransformed(){
    let results = await readSymptomsData();
    return symptomsDataTransform(results);
}

async function readDisease(diseaseName) {
    const endpoint = 'https://en.wikipedia.org/w/api.php?';
    const params = {
        origin: '*',
        format: 'json',
        // peform query action on wiki
        action: 'query',
        // return extracts of the given page
        prop: 'extracts',
        //return content before the first section
        exintro: true,
        //return in plain text
        explaintext: true,
        generator: 'search',
        gsrlimit: 1,
    };

    params.gsrsearch = diseaseName;
    let response = await axios.get(endpoint, { params });
    console.log(response);

}

async function getImage() {
    //credit to pexels
    // <a href="https://www.pexels.com">Photos provided by Pexels</a>
    const PEXEL_API_KEY = "563492ad6f91700001000001b48bc8b04e5c404db7fbfccf0d8824a2";
    const endpoint = 'https://api.pexels.com/v1/search';
    let response = await axios.get(endpoint, {
        params: {
            query: "cough",
            per_page: 1,
            size: "small"
        },

        headers: {
            Authorization: PEXEL_API_KEY,
        },
    });
    console.log(response);
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

function transformAdverseEventData(results) {
    let arrayData = [];
    let count = 0;

    const d = new Date();
    let currentYear = d.getFullYear();
    for (let year = 2004; year <= currentYear; year++) {
        for (let el of results) {
            if (Number(el.time.slice(0, 4)) === year) {
                count = count + Number(el.count);
            }
        }
        arrayData.push({ x: year, y: count });
    }
    return arrayData;
}

async function getEffectDataTranformed(drugName) {
    let results = await getAdverseEventOverTime(drugName);
    return transformAdverseEventData(results);
}


//below gets the side effects type reported from 2014 to current date
async function getAdverseEventType(drugName="BioNTech, Pfizer vaccine") {
    const DRUGEVENT_BASE_URL = "https://api.fda.gov/drug/event.json";
    let response = await axios.get(`https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20220226])+AND+${drugName}&count=patient.reaction.reactionmeddrapt.exact`);
    return response.data.results;
}


function getTopFiveEvent(results){
    let arrayData = [];
    for(let i=0; i<5; i++){
        let oneEvent = {x: results[i].term, y: Number(results[i].count)}
        arrayData.push(oneEvent);
    }
    return arrayData   
}

async function getEventsTransformed(drugName){
    let results = await getAdverseEventType(drugName);
    return getTopFiveEvent(results);
}

//return drug name by users' symptoms and disease
async function getDrug(symptom) {
    const OPENFDA_API_KEY = "IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL";
    const DRUGLABEL_BASE_URL = "https://api.fda.gov/drug/label.json";

    let response = await axios.get(DRUGLABEL_BASE_URL, {
        params: {
            api_key: OPENFDA_API_KEY,
            search: "purpose:" + symptom,
            limit: 10
        }
    });

    return response.data.results;
}

function transformDrugData(results) {
    let transformed = [];
    let count = 0;
    for (let el of results) {
        if (count === 3) {
            break;
        }
        if (el.openfda.brand_name) {
            transformed.push(el);
            count++;
        }
    }
    return transformed;
}

async function getTransformedDrug(symptom) {
    let results = await getDrug(symptom);
    return transformDrugData(results);
}

