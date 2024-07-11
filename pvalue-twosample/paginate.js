const section1 = document.querySelector("#section-1")
const section2 = document.querySelector("#section-2")
const sections = [section1, section2]

const tabSection1 = document.querySelector("#tab-section-1")
const tabsection2 = document.querySelector("#tab-section-2")

let currentSectionIdx = 0
highlightTab(currentSectionIdx)

function switchTab(idx) {
    if (currentSectionIdx != idx) {
        if (currentSectionIdx == 0) {
            hidePage();
            index = 0;
        }
        sections[currentSectionIdx].style.display = "none";
        sections[idx].style.display = "block";

        dehighlightTab(currentSectionIdx);
        highlightTab(idx);

        currentSectionIdx = idx;
        if (idx == 0) {
            page1.style.display = "block"
        }
    }
}

function highlightTab(idx) {
    let tab = document.getElementById(`tab-section-${idx + 1}`)
    tab.className += " active"
}

function dehighlightTab(idx) {
    let tab = document.getElementById(`tab-section-${idx + 1}`)
    tab.className = tab.className.replace(" active", "")
}

tabSection1.addEventListener("click", () => switchTab(0));
tabsection2.addEventListener("click", () => switchTab(1));

const page1 = document.querySelector("#page1");
const page2 = document.querySelector("#page2");
const page3 = document.querySelector("#page3");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const pageNumberValue = document.querySelector("#page-number")

let index = 0;

const pages = [page1, page2, page3]

function hidePage() {
    let pageToHide = pages[index];
    pageToHide.style.display = "none";
}

function showPage() {
    let pageToDisplay = pages[index];
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