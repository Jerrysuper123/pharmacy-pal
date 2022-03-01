// show app brief through the barIcon
document.querySelector("#barIcon").addEventListener("click", function () {
  let page = document.querySelector("#appBrief");
  page.classList.remove("hideLeft");
  page.classList.add("show");
});

// //hide app brief through grey area
document.querySelector("#appBriefHide").addEventListener("click", function () {
  let page = document.querySelector("#appBrief");
  page.classList.remove("show");
  page.classList.add("hideLeft");
});

//hide app brief thru x button
document
  .querySelector("#closeAppBriefBtn")
  .addEventListener("click", function () {
    let page = document.querySelector("#appBrief");
    page.classList.remove("show");
    page.classList.add("hideLeft");
  });

//show drug page
document.querySelector("#drugAdvisorBtn").addEventListener("click", function () {
  let page = document.querySelector("#drugAdvisorPage");
  page.classList.remove("hideLeft");
  page.classList.add("show");
});

//hide drug page through back button
document
  .querySelector("#closeAdvisorPage")
  .addEventListener("click", function () {
    let page = document.querySelector("#drugAdvisorPage");
    page.classList.remove("show");
    page.classList.add("hideLeft");
  });

// //show pharmacy page
// document.querySelector("#ePharmacyBtn").addEventListener("click", function () {
//   let page = document.querySelector("#ePharmacyPage");
//   page.classList.remove("hideLeft");
//   page.classList.add("show");
// });

// //hide epharmacy page through back button
// document
//   .querySelector("#ePharmacyBackBtn")
//   .addEventListener("click", function () {
//     let page = document.querySelector("#ePharmacyPage");
//     page.classList.remove("show");
//     page.classList.add("hideLeft");
//   });
