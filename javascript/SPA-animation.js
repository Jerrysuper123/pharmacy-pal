// //show app brief
document.querySelector("#barIcon").addEventListener("click", function () {
  let appBrief = document.querySelector("#appBrief");
  appBrief.classList.remove("hideLeft");
  appBrief.classList.add("show");
});

// //hide app brief
document.querySelector("#appBriefHide").addEventListener("click", function () {
  let appBrief = document.querySelector("#appBrief");
  appBrief.classList.remove("show");
  appBrief.classList.add("hideLeft");
});

//show drug page
document.querySelector("#searchOTCBtn").addEventListener("click", function () {
  let page = document.querySelector("#searchOTCPage");
  page.classList.remove("hideLeft");
  page.classList.add("show");
});

//show pharmacy page
document.querySelector("#ePharmacyBtn").addEventListener("click", function () {
  let page = document.querySelector("#ePharmacyPage");
  page.classList.remove("hideLeft");
  page.classList.add("show");
});
