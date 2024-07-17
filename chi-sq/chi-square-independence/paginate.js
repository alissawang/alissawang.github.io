import { expectedValuesTransition, expectedValuesReset, chiSqTransition, chiSqReset, dofTransition, dofReset, dofGraphTransition, dofGraphReset } from "./chiSqIndependence.js";

const page1 = document.querySelector("#page1");
const page2 = document.querySelector("#page2");
const page3 = document.querySelector("#page3");
const page4 = document.querySelector("#page4");
const page5 = document.querySelector("#page5");
const page6 = document.querySelector("#page6");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const replayButton = document.querySelector("#replay-button");

let index = 0;

const pages = [page1, page2, page3, page4, page5, page6]

function hidePage() {
    let pageToHide = pages[index];
    if (index == 2) {
        expectedValuesReset()
    }
    if (index == 4) {
        dofReset()
    }
    if (index == 5) {
        dofGraphReset()
    }
    pageToHide.style.display = "none";
}

function showPage() {
    let pageToDisplay = pages[index];
    pageToDisplay.style.display = "block"
    if (index == 2) {
        expectedValuesTransition()
    }
    if (index == 3) {
        chiSqTransition()
    }
    if(index == 4) {
        dofTransition()
    }
    if(index == 5) {
        dofGraphTransition()
    }
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