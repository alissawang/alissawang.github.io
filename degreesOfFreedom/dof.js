import { sum } from "../utils/math.js"

function inferFromMean(mean, n, allValues) {
    return (mean * n) - sum(allValues)
}

function inferFromSum(result, allValues) {
    return result - sum(allValues)
}

function processInputs(inputObjs, staticResult, inferFunc) {
    let n = inputObjs.length
    let constrainedInput = inputObjs.at(-1)
    let independentInputs = inputObjs.slice(0, n - 1)
    constrainedInput.disabled = true;

    for (let i = 0; i < (n - 1); i++) {
        let inputObj = inputObjs[i];
        inputObj.oninput = function() {
            if (independentInputs.every(input => (input.value))) {
                constrainedInput.value = inferFunc(staticResult, n, independentInputs.map(input => parseFloat(input.value)))
            }
        }
    }
}

var meanInputs = [
    document.getElementById("mean-input1"),
    document.getElementById("mean-input2"),
    document.getElementById("mean-input3")
]
var meanDisplay = document.getElementById("mean")
var staticMean = 10;
meanDisplay.innerHTML = staticMean;
processInputs(meanInputs, staticMean, inferFromMean);

var meanDiffInputs1 = [
    document.getElementById("mean-diff-input1"),
    document.getElementById("mean-diff-input2"),
    document.getElementById("mean-diff-input3")
]
var meanDiffInputs2 = [
    document.getElementById("mean-diff-input4"),
    document.getElementById("mean-diff-input5")
]
var meanDiffDisplay = document.getElementById("mean-diff");
var staticMeanDiff = 10
var meanDiffStaticMean1 = 5;
var meanDiffStaticMean2 = 15;
meanDiffDisplay.innerHTML = staticMeanDiff;
processInputs(meanDiffInputs1, meanDiffStaticMean1, inferFromMean);
processInputs(meanDiffInputs2, meanDiffStaticMean2, inferFromMean);

function processInputsChiSq(inputRows, rowMargins, columnMargins) {
    let r = inputRows.length
    let c = inputRows.at(0).length
    let columns = d3.range(c).map(colnum => inputRows.map(input => input.at(colnum)))
    let constrainedInputs = inputRows.at(-1).concat(columns.at(-1))
    let independentInputs = inputRows.flat().filter(input => !constrainedInputs.includes(input))

    for (let rownum = 0; rownum < (r - 1); rownum++) {
        let rowTotal = rowMargins.at(rownum)
        let row = inputRows.at(rownum)
        let rowConstrainedInput = row.at(-1)
        let rowIndependentInputs = row.slice(0, c - 1)
        for (let colnum = 0; colnum < (c - 1); colnum++) {
            let colTotal = columnMargins.at(colnum)
            let inputObj = row.at(colnum);
            let column = columns.at(colnum)
            let colIndependentInputs = column.slice(0, r - 1)
            let colConstrainedInput = column.at(-1)
            inputObj.oninput = function() {
                if (rowIndependentInputs.every(input => (input.value))) {
                    rowConstrainedInput.value = inferFromSum(rowTotal, rowIndependentInputs.map(input => parseFloat(input.value)))
                }
                if (colIndependentInputs.every(input => (input.value))) {
                    colConstrainedInput.value = inferFromSum(colTotal, colIndependentInputs.map(input => parseFloat(input.value)))
                }
                if (independentInputs.every(input => (input.value))) {
                    let cornerValue = inputRows.at(-1).at(-1)
                    let lastColumnTotal = columnMargins.at(-1)
                    let lastColumn = columns.at(-1)
                    cornerValue.value = inferFromSum(lastColumnTotal, lastColumn.slice(0, r - 1).map(input => parseFloat(input.value)))
                }
            }
        }
    }
}

var chiSqTypeTotal1 = 100;
var chiSqTypeTotal2 = 150;
var chiSqGroupTotalA = 70;
var chiSqGroupTotalB = 80;
var chiSqGroupTotalC = 100;
var chiSqTotal = 250
var chiSqTypeTotal1Display = document.getElementById("chisq-type1-total");
var chiSqTypeTotal2Display = document.getElementById("chisq-type2-total");
var chiSqGroupTotalADisplay = document.getElementById("chisq-groupA-total");
var chiSqGroupTotalBDisplay = document.getElementById("chisq-groupB-total");
var chiSqGroupTotalCDisplay = document.getElementById("chisq-groupC-total");

var chiSqTotalDisplay = document.getElementById("chisq-total");
chiSqTypeTotal1Display.innerHTML = chiSqTypeTotal1;
chiSqTypeTotal2Display.innerHTML = chiSqTypeTotal2;
chiSqGroupTotalADisplay.innerHTML = chiSqGroupTotalA;
chiSqGroupTotalBDisplay.innerHTML = chiSqGroupTotalB;
chiSqGroupTotalCDisplay.innerHTML = chiSqGroupTotalC;

chiSqTotalDisplay.innerHTML = chiSqTotal;

var chiSqInputs1 = [
    document.getElementById("chisq-input1"),
    document.getElementById("chisq-input2"),
    document.getElementById("chisq-input3")
]
var chiSqInputs2 = [
    document.getElementById("chisq-input4"),
    document.getElementById("chisq-input5"),
    document.getElementById("chisq-input6")
]
var typeTotals = [chiSqTypeTotal1, chiSqTypeTotal1]
var groupTotals = [chiSqGroupTotalA, chiSqGroupTotalB, chiSqGroupTotalC]
var rows = [chiSqInputs1, chiSqInputs2]
processInputsChiSq(rows, groupTotals, typeTotals)
