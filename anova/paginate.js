import { transitionSSTExample, resetSSTExample, transitionSSEExample, resetSSEExample, transitionDiffCompare, resetDiffCompare, transitionSSTFull, resetSSTFull, transitionStop, transitionSSEFull, resetSSEFull , transitionCalculateF, resetCalculateF, displayF, resetDisplayF} from "./anovaOneWay.js";
import { dofTransition, dofReset } from "./anovaFGraph.js";
const page1 = document.querySelector("#page1");
const page2 = document.querySelector("#page2");
const page3 = document.querySelector("#page3");
const page4 = document.querySelector("#page4");
const page5 = document.querySelector("#page5");
const page6 = document.querySelector("#page6");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const replayButton = document.querySelector("#replay-button")

let index = 0;

const pages = [page1, page2, page3, page4, page5, "page5b", "page5c", "page5d", page6]

function hidePage() {
    if (index == 1) {
        resetSSTExample()
    }
    if (index == 2) {
        resetSSEExample()
    }
    if (index == 3) {
        resetDiffCompare()
    }
    if (index == 4) {
        resetSSTFull()
    }
    if (index == 5) {
        resetSSEFull()
    }
    if (index == 6) {
        resetCalculateF()
    }
    if (index == 7) {
        resetDisplayF()
    }
    if (index == 8){
        dofReset()
        let pageToDisplay = pages[4];
        pageToDisplay.style.display = "block"
    }
    if (index < 4 || index >= 8) {
        let pageToHide = pages[index];
        pageToHide.style.display = "none"
    }
}

function showPage() {
    if (index <= 4 || index >= 8) {
        let pageToDisplay = pages[index];
        pageToDisplay.style.display = "block"
    }
    if (index == 1) {
        transitionSSTExample()
    }
    if (index == 2) {
        transitionSSEExample();
    }
    if (index == 3) {
        transitionDiffCompare();
    }
    if (index == 4) {
        transitionSSTFull()
    }
    if (index == 5) {
        transitionStop()
        transitionSSEFull()
    }
    if (index == 6) {
        transitionStop()
        transitionCalculateF()
    }
    if (index == 7) {
        displayF();
    }
    if (index == 8) {
        let pageToHide = pages[4];
        pageToHide.style.display = "none"
        dofTransition()
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
    hidePage();
    if (index < pages.length - 1) {
        index += 1;
    }
    showPage();
  });

replayButton.addEventListener("click", () => {
    hidePage();
    showPage();
})