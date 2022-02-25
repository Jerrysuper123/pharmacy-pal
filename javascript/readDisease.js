
//read Includes symptoms, treatment, mode of transmission.
//1. read symptoms
//2. decide kind of drug
//3. whether available in pharmacy

async function readDisease(){
    //not very useful, only return 46 disease type below, symptoms also, not very clear
    // let response = await axios.get("https://disease-info-api.herokuapp.com/diseases.json")

    //below is the wikipea return full page of a disease
    let response = await axios.get("https://en.wikipedia.org/w/api.php?action=parse&page=cough&prop=text")
    console.log(response);
}