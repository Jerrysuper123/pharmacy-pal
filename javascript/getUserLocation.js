//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

function getUserLocation() {
  function success(pos) {
    var crd = pos.coords;

    // return [crd.latitude, crd.longitude];

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);

    return "user location";
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error);
}
