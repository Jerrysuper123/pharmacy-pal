
/*utility for symptom checker page */
async function readSymptomsData() {
    let response;
    try {
        response = await axios.get("../localData/diseaseAndSymptoms.csv");
        return response.data.split("\r\n");
    } catch (error) {
        console.log("Unable to read local diseaseAndSymptoms.csv file");
        return [];
    }

}

function symptomsDataTransform(results) {
    if (results.length === 0) return;
    //remove column headers of csv
    let arrayData = [];
    let oneArray = [];
    let finalResults = [];
    //create a set to contain unique symptoms
    let symptomsSet = new Set();
    results.shift();

    for (let el of results) {
        //split one string into elements of an array
        arrayData.push(el.split(","));
    }

    //trim and remove empty spaces
    for (let el of arrayData) {
        oneArray = [];
        for (let string of el) {
            let oneString = string.trim();
            if (oneString !== "") {
                oneArray.push(oneString);
            }
        }
        finalResults.push(oneArray);
    }

    //making final objects
    //[{disease: symptoms..},{...}]
    let objArray = [];
    for (el of finalResults) {
        let diseaseName = el[0];
        // console.log(diseaseName)
        let symptoms = el.slice(1);

        //create symptom for searching
        for (oneSymptom of symptoms) {
            symptomsSet.add(oneSymptom);
        }
        let obj = {};
        obj[diseaseName] = symptoms;
        // console.log(obj);
        objArray.push(obj);
    }

    // convert set back to array
    return [objArray, Array.from(symptomsSet)];
}

async function getSymptomsDataTransformed() {
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
    let response;

    try {
        response = await axios.get(endpoint, { params });
        let pageObject = response.data.query.pages;
        let pageInfo = Object.values(pageObject)[0];
        let title = pageInfo.title;
        let body = pageInfo.extract;
        return [title, body];
    } catch (error) {
        catchStatusCodeError(error, "#symptomsValidationResult", "Wikipedia disease API");
        return [];
    }

}

async function getImage(diseaseName) {
    //credit to pexels
    // <a href="https://www.pexels.com">Photos provided by Pexels</a>
    const PEXEL_API_KEY = "563492ad6f91700001000001b48bc8b04e5c404db7fbfccf0d8824a2";
    const endpoint = 'https://api.pexels.com/v1/search';
    let response;

    try {
        response = await axios.get(endpoint, {
            params: {
                query: diseaseName,
                per_page: 1,
                size: "small"
            },

            headers: {
                Authorization: PEXEL_API_KEY,
            },
        });

        //return medium image size url
        try{
            return response.data.photos[0].src.medium;
        } catch(error) {
            console.log(error);
            //return sample image
            return "./images/pharmacy.png";
        }
        
    }
    catch (error) {
        catchStatusCodeError(error,"#symptomsValidationResult", "Pexels Picture API" );
        return "";
    }
}

async function getTitleBodyImg(diseaseName) {
    let titleBody = await readDisease(diseaseName);
    let image = await getImage(diseaseName);

    //[[title, body], image]
    return [titleBody, image]
}

function catchStatusCodeError(error, useNoteId, APIName) {
    if (error.response) {
        let statusCode = Number(error.response.status);
        let userNote = document.querySelector(useNoteId);
        if (statusCode === 404) {
            userNote.innerHTML = `
                You search did not match anything in our database.
        Try a different name for the same search.
            `;
            /*Open FDA adverse events API return 500, if user search for empty string*/
        } else if (statusCode === 500) {
            console.log("500 error")
            userNote.innerHTML = `
                You have entered an empty string.
            `;
        } else {
            userNote.innerHTML = `
            ${APIName} Failed: ${statusCode}
            `;
        }
        /*credit:https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253 */
    } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log(error.request);
    } else {
        // Something happened in setting up the request and triggered an Error
        console.log('Error', error.message);
    }
    console.log(error);
}

/*Utility for drug match diseases */
//return drug name by users' symptoms and disease
async function getDrug(symptom) {
    const OPENFDA_API_KEY = "IIkjoiok33N5aEpSrb9XDMHXw7PPdiXZc2NFfYHL";
    const DRUGLABEL_BASE_URL = "https://api.fda.gov/drug/label.json";

    let response;

    try {
        response = await axios.get(DRUGLABEL_BASE_URL, {
            params: {
                api_key: OPENFDA_API_KEY,
                search: "purpose:" + symptom,
                limit: 10
            }
        });
        return response.data.results;

    } catch (error) {
        catchStatusCodeError(error, "#diseaseMatchDrugValidationResult", "Open FDA drug match disease API");
        return [];
    }
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


/*ulility for drug side effects page */
async function getAdverseEventOverTime(drugName) {
    const DRUGEVENT_BASE_URL = "https://api.fda.gov/drug/event.json";
    let response;

    try {
        response = await axios.get(`https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20220225])+AND+${drugName}&count=receivedate`);
        return response.data.results;

    } catch (error) {
        catchStatusCodeError(error, "#drugSideEffectsValidationResult", "Open FDA adverse event count over time API");
        return [];
    }
}

function transformAdverseEventData(results) {
    let arrayData = [];
    let count = 0;

    const d = new Date();
    let currentYear = d.getFullYear();
    /*only get yearly data for the past five years */
    let startingYear = currentYear - 4;
    for (let year = startingYear; year <= currentYear; year++) {
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
async function getAdverseEventType(drugName = "BioNTech, Pfizer vaccine") {
    const DRUGEVENT_BASE_URL = "https://api.fda.gov/drug/event.json";
    let response;
    try {
        response = await axios.get(`https://api.fda.gov/drug/event.json?search=(receivedate:[20040101+TO+20220226])+AND+${drugName}&count=patient.reaction.reactionmeddrapt.exact`);
        // console.log(response.data.results);
        return response.data.results;

    } catch (error) {
        catchStatusCodeError(error, "#drugSideEffectsValidationResult", "Open FDA adverse event type API");
        return [];
    }
}

function getTopFiveEvent(results) {
    if (results.length === 0) {
        return [];
    }
    let arrayData = [];
    for (let i = 0; i < 5; i++) {
        let oneEvent = { x: results[i].term, y: Number(results[i].count) }
        arrayData.push(oneEvent);
    }
    return arrayData;
}

async function getEventsTransformed(drugName) {
    let results = await getAdverseEventType(drugName);
    return getTopFiveEvent(results);
}

