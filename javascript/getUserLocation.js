//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition

// function getUserLocation() {
//   let options = {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0
//   };

//   function success(pos) {
//     let crd = pos.coords;
//     console.log("Your current position is:");
//     console.log(`Latitude : ${crd.latitude}`);
//     console.log(`Longitude: ${crd.longitude}`);

//     let lat = Number(crd.latitude);
//     let lng = Number(crd.longitude);

//     return [crd.latitude,crd.longitude ];
//   }

//   function error(err) {
//     console.warn(`ERROR(${err.code}): ${err.message}`);
//     alert("Please allow us to access your location to find the pharmacy near you!")
//   }

//  navigator.geolocation.getCurrentPosition(success, error, options);

// }
