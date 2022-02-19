//show app brief
document.querySelector("#barIcon").addEventListener("click", function () {
  let appBrief = document.querySelector("#appBrief");
  appBrief.classList.remove("hideLeft");
  appBrief.classList.add("show");
});

//hide app brief
document.querySelector("#appBrief").addEventListener("click", function () {
  let appBrief = document.querySelector("#appBrief");
  appBrief.classList.remove("show");
  appBrief.classList.add("hideLeft");
});

//show search OTC drug page
document.querySelector("#searchOTCBtn").addEventListener("click", function () {
  let appBrief = document.querySelector("#searchOTCPage");
  appBrief.classList.remove("hideTop");
  appBrief.classList.add("show");
});

//hide search OTC drug page
document.querySelector(".greyContainer").addEventListener("click", function () {
  let appBrief = document.querySelector("#searchOTCPage");
  appBrief.classList.remove("show");
  appBrief.classList.add("hideTop");
});

//e-pharmacy page
document.querySelector("#ePharmacyBtn").addEventListener("click", function () {
  let appBrief = document.querySelector("#ePharmacyPage");
  appBrief.classList.remove("hideTop");
  appBrief.classList.add("show");
});

document.querySelector("#ePharmacyPage").addEventListener("click", function () {
  let appBrief = document.querySelector("#ePharmacyPage");
  appBrief.classList.remove("show");
  appBrief.classList.add("hideTop");
});
