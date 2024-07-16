import { page1Transition, page1Reset, page2Transition, page2Reset, page3Transition, page3Reset, page4Transition } from "./one-sample-t.js"

const page1 = document.querySelector("#page1");
const page2 = document.querySelector("#page2");
const page3 = document.querySelector("#page3");
const page4 = document.querySelector("#page4");
const page5 = document.querySelector("#page5");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const replayButton = document.querySelector("#replay-button");

let index = 0;

const pages = [page1, page2, page3, page4, page5]

function hidePage() {
    let pageToHide = pages[index];
    if (index == 0) {
        page1Reset();
    }
    if (index == 1) {
        page2Reset();
    }
    if (index == 2) {
        page3Transition();
    }
    if (index == 3) {
        page4Transition();
    }
    pageToHide.style.display = "none";
}

function showPage() {
    let pageToDisplay = pages[index];
    if (index == 0) {
        page1Transition();
    };
    if (index == 1) {
        page2Transition();
    };
    if (index == 2) {
        page3Reset();
    }
    pageToDisplay.style.display = "block"
}

prevButton.addEventListener("click", () => {
    if (index > 0) {
        hidePage();
        index -= 1;
    }
    showPage();
})
nextButton.addEventListener("click", () => {
    if (index < pages.length - 1) {
        hidePage();
        index += 1;
    }
    showPage();
  });

replayButton.addEventListener("click", () => {
    hidePage()
    showPage()
})

showPage();