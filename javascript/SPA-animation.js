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

  let allButtons = document.querySelectorAll("#drugNavBar button");
  // console.log(allButtons);
  for (let btn of allButtons) {
    btn.addEventListener("click", function (event) {
      let selectedBtn = event.target;
      //data-page="1";
      //dataset = {page: '1'};
      let pageNumber = selectedBtn.dataset.page;
      console.log("click pagenumber" + pageNumber);
  
      let pages = document.querySelectorAll(".page");
      for (let p of pages) {
        //it is okay to remove non existing class
        p.classList.remove("show");
        p.classList.add("hidden");
      }
  
      let page = document.querySelector("#page-" + pageNumber);
      page.classList.remove("hidden");
      page.classList.add("show");
    });
  }
  