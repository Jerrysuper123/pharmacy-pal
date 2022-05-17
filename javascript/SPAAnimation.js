// show landing page through the barIcon
document.querySelector("#barIcon").addEventListener("click", function () {
  let page = document.querySelector("#appBrief");
  page.classList.remove("hideLeft");
  page.classList.add("show");
});

//show map by clicking on the drugadvisor company logo
document.querySelector("#landingBtn").addEventListener("click", function () {
  let page = document.querySelector("#drugAdvisorPage");
  page.classList.remove("show");
  page.classList.add("hideLeft");
});

//show map by clicking on the landing page company logo
document.querySelector("#mapBtn").addEventListener("click", function () {
  let page = document.querySelector("#appBrief");
  page.classList.remove("show");
  page.classList.add("hideLeft");
});

//hide landing page through grey area
document.querySelector("#appBriefHide").addEventListener("click", function () {
  let page = document.querySelector("#appBrief");
  page.classList.remove("show");
  page.classList.add("hideLeft");
});

//hide landing page thru x button
document
  .querySelector("#closeAppBriefBtn")
  .addEventListener("click", function () {
    let page = document.querySelector("#appBrief");
    page.classList.remove("show");
    page.classList.add("hideLeft");
  });

//show drug advisor page
document.querySelector("#drugAdvisorBtn").addEventListener("click", function () {
  let page = document.querySelector("#drugAdvisorPage");
  page.classList.remove("hideLeft");
  page.classList.add("show");
});

//hide drug advisor page
document
  .querySelector("#closeAdvisorPage")
  .addEventListener("click", function () {
    let page = document.querySelector("#drugAdvisorPage");
    page.classList.remove("show");
    page.classList.add("hideLeft");
  });

  let allButtons = document.querySelectorAll("#drugNavBar button");
  for (let btn of allButtons) {
    btn.addEventListener("click", function (event) {
      for(let btn of allButtons){
        btn.classList.remove("changeBtnColorToWhite");
      }
      let selectedBtn = event.target;
      selectedBtn.classList.add("changeBtnColorToWhite");
      //data-page="1";
      //dataset = {page: '1'};
      let pageNumber = selectedBtn.dataset.page;
  
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
  