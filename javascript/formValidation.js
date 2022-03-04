
//set this to be a global variable to be used later
let globalValidationResults = "";

function formValidate(userInput){
    let hasError = false;
    if(userInput === ""){
        hasError = true;
        globalValidationResults = "You have entered an empty string!"
    }

    return hasError;
}