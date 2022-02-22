//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

async function getUserLocation() {
  function success(pos) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    let lat = Number(crd.latitude);
    let lng = Number(crd.longitude);


    return [lat,lng];


    // return "user location";
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    alert("Please allow us to access your location to find the pharmacy near you!")
  }

  await navigator.geolocation.getCurrentPosition(success, error);
}
