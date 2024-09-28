const lesson = document.querySelector("#lesson")
const playground = document.querySelector("#playground")
const tab1 = document.querySelector("#tab-lesson")
const tab2 = document.querySelector("#tab-playground")
const pageButtons = document.querySelector(".page-buttons")

tab1.addEventListener("click", () => {
    lesson.style.display = "block";
    playground.style.display = "none";
    pageButtons.style.display = "block";
    buttonFocus(tab1);
    buttonRelease(tab2);
})

tab2.addEventListener("click", () => {
    playground.style.display = "block";
    lesson.style.display = "none";
    pageButtons.style.display = "none";
    buttonFocus(tab2);
    buttonRelease(tab1);
})

tab2.addEventListener("click", () => {
    if (index > 0) {
        hidePage();
        index -= 1;
    }
    showPage();
})

function buttonFocus(button) {
    if (!button.className.includes("active")) {
        button.className += " active"
    }
}

function buttonRelease(button) {
    button.className = button.className.replace(" active", "")
}

buttonFocus(tab1);

const page1 = document.querySelector("#page1");
const page2 = document.querySelector("#page2");
const page3 = document.querySelector("#page3");

const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

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
        if(index != 2) {
            hidePage();
        }
        index += 1;
    }
    showPage();
  });