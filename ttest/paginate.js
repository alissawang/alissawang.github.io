const oneSample = document.querySelector("#one-sample")
const twoSample = document.querySelector("#two-sample")
const sections = [oneSample, twoSample]

const oneSampleButton = document.getElementById("one-sample-button")
const twoSampleButton = document.getElementById("two-sample-button")
const buttons = [oneSampleButton, twoSampleButton]

let currentSectionIdx = null;

function switchTab(idx) {

    if (currentSectionIdx == null) {
        sections[idx].style.display = "block";
        buttonFocus(idx);
    } else if (currentSectionIdx != idx) {
        sections[currentSectionIdx].style.display = "none";
        sections[idx].style.display = "block";
        buttonRelease(currentSectionIdx)
        buttonFocus(idx)
    }

    currentSectionIdx = idx;
}

function buttonFocus(idx) {
    let button = buttons[idx];
    button.style.background = "#bad6e8";
    button.style.color = "white";
    button.className += " active"
}

function buttonRelease(idx) {
    let button = buttons[idx];
    button.style.background = "#dfedf6";
    button.style.color = "#8fc6dd";
    button.className = button.className.replace(" active", "")
}

oneSampleButton.addEventListener("click", () => switchTab(0));
twoSampleButton.addEventListener("click", () => switchTab(1));