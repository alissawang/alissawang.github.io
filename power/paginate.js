import { transitionAUCPower, resetAUCPower, showDefinitions, hideDefinitions } from "./power.js";

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
const page3b = document.querySelector("#page3b");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

let index = 0;

const pages = [page1, page2, page3, page3b]

function hidePage() {
    let pageToHide = pages[index];
    if (index == 1) {
        resetAUCPower()
    }
    pageToHide.style.display = "none";
}

function showPage() {
    let pageToDisplay = pages[index];
    pageToDisplay.style.display = "block"
    if (index == 1) {
        transitionAUCPower()
    }
    if(index == 2) {
        showDefinitions()
    }
    if(index == 3) {
        hideDefinitions()
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
        if(index != 2) {
            hidePage();
        }
        index += 1;
    }
    showPage();
  });