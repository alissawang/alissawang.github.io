import { expectedValuesTransition, expectedValuesReset, chiSqTransition, chiSqReset, dofTransition, dofReset, dofGraphTransition, dofGraphReset } from "./chiSqIndependence.js";

// const section0 = document.querySelector("#section-0")
// const section1 = document.querySelector("#section-1")
// const sections = [section0, section1]

// const tabSection0 = document.querySelector("#tab-section-0")
// const tabSection1 = document.querySelector("#tab-section-1")

// let currentSectionIdx = 0
// highlightTab(currentSectionIdx)

// function switchTab(idx) {
//     if (currentSectionIdx != idx) {
//         sections[currentSectionIdx].style.display = "none";
//         sections[idx].style.display = "block";

//         dehighlightTab(currentSectionIdx);
//         highlightTab(idx);

//         currentSectionIdx = idx;
//     }
// }

// function highlightTab(idx) {
//     let tab = document.getElementById(`tab-section-${idx}`)
//     tab.className += " active"
// }

// function dehighlightTab(idx) {
//     let tab = document.getElementById(`tab-section-${idx}`)
//     tab.className = tab.className.replace(" active", "")
// }

// tabSection0.addEventListener("click", () => switchTab(0));
// tabSection1.addEventListener("click", () => switchTab(1));

const page1 = document.querySelector("#page1");
const page2 = document.querySelector("#page2");
const page3 = document.querySelector("#page3");
const page4 = document.querySelector("#page4");
const page5 = document.querySelector("#page5");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

let index = 0;

const pages = [page1, page2, page3, page4, page5]

function hidePage() {
    let pageToHide = pages[index];
    if (index == 2) {
        expectedValuesReset()
    }
    if (index == 3) {
        chiSqReset()
    }
    if (index == 4) {
        dofReset()
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