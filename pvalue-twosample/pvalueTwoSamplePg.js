import { empty1DGraph, drawDistribution } from "../utils/graph.js"
import { generateNormalData, sampleNormalDistribution, seedSampleNormalDistribution, forceArrayMean } from "../utils/data.js"
import { mean, standardDeviation, roundDecimal, normalPdf, areaUnderCurve } from "../utils/math.js"

var margin = ({
    top: 0,
    right: 30,
    bottom: 500,
    left: 80
})

var sampleWidth = 600
var sampleHeight = 200

var popMean1 = 35.1
var popMean2 = 35.9

var rawSample1 = sampleNormalDistribution(popMean1, 1.8, 30).map(d => d.x).sort()
var rawSample2 = seedSampleNormalDistribution(popMean2, 1.2, 30).map(d => d.x).sort()
var sample1 = forceArrayMean(rawSample1, popMean1)
var sample2 = forceArrayMean(rawSample2, popMean2)
var mean1 = mean(sample1)
var mean2 = mean(sample2)
var sd1 = standardDeviation(sample1)
var sd2 = standardDeviation(sample2)

const sampleOffset = 100
const sample1Height = margin.top + 40
const sampleSvg = d3.select("#samples-pg").append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)
sampleSvg.append("text")
    .text("Group 1")
    .attr("class", "x-axis-label")
    .attr("x", 0)
    .attr("y", sample1Height)
sampleSvg.append("text")
    .text("Group 2")
    .attr("class", "x-axis-label")
    .attr("x", 0)
    .attr("y", sample1Height + sampleOffset)

const sampleXGraphValues = empty1DGraph(sampleSvg, d3.range(30, 41, 1), sampleWidth, sampleHeight, margin)

const sample1Slider = document.getElementById("sample-1-slider")
const sample2Slider = document.getElementById("sample-2-slider")
sample1Slider.oninput = function() {
    popMean1 = parseFloat(this.value)
    sample1 = forceArrayMean(sampleNormalDistribution(popMean1, 1.8, 30).map(d => d.x).sort(), popMean1)
    mean1 = mean(sample1)
    updateSampleSvg(1, sample1)
    updateVariance()
    updatePValue()
}
sample2Slider.oninput = function() {
    popMean2 = parseFloat(this.value)
    sample2 = forceArrayMean(sampleNormalDistribution(popMean2, 1.8, 30).map(d => d.x).sort(), popMean2)
    mean2 = mean(sample2)
    updateSampleSvg(2, sample2)
    updateVariance()
    updatePValue()
}
sample1Slider.value = popMean1
sample2Slider.value = popMean2

var dimY = (sampleHeight / 2) - 10
var differenceInMeans = Math.abs(mean1 - mean2)

updateSampleSvg(1, sample1)
updateSampleSvg(2, sample2)
updateVariance()

function updateSampleSvg(groupNum, sample) {
    let mean_ = mean(sample)
    let sampleValuesHeight = (groupNum == 1) ? sample1Height : (sample1Height + sampleOffset)
    differenceInMeans = Math.abs(mean1 - mean2)
    sampleSvg.selectAll(`#sample-values-${groupNum}`).remove()
    sampleSvg.selectAll(`#mean-${groupNum}`).remove()
    sampleSvg.selectAll(`#mean-${groupNum}-text`).remove()
    sampleSvg.selectAll("#dim").remove()
    sampleSvg.selectAll("#dim-text").remove()

    sampleSvg.selectAll(`#sample-values-${groupNum}`)
        .data(sample)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("id", `sample-values-${groupNum}`)
        .attr("cx", d => sampleXGraphValues(d))
        .attr("cy", sampleValuesHeight)
    sampleSvg.append("line")
        .attr("id", `mean-${groupNum}`)
        .attr("x1", sampleXGraphValues(mean_))
        .attr("x2", sampleXGraphValues(mean_))
        .attr("y1", dimY)
        .attr("y2", (groupNum == 1) ? dimY - 50 : dimY + 50).lower()
    sampleSvg.append("text")
        .attr("id", `mean-${groupNum}-text`)
        .text(`x̄ = ${roundDecimal(mean_, 2)}`)
        .attr("x", sampleXGraphValues(mean_))
        .attr("y", (groupNum == 1) ? sampleValuesHeight - 20 : sampleValuesHeight + 25)

    sampleSvg.append("line")
        .attr("id", "dim")
        .attr("x1", sampleXGraphValues(mean1))
        .attr("x2", sampleXGraphValues(mean2))
        .attr("y1", dimY)
        .attr("y2", dimY)
    sampleSvg.append("text")
        .attr("id", "dim-text")
        .text(roundDecimal(differenceInMeans, 2))
        .attr("x", sampleXGraphValues(mean1) + 20)
        .attr("y", dimY - 10)
}

var sd1Rounded = roundDecimal(sd1, 2)
var sd2Rounded = roundDecimal(sd2, 2)
var n1 = sample1.length
var n2 = sample2.length
var pooledVariance = (sd1Rounded ** 2 / n1) + (sd2Rounded ** 2 / n2)
var pooledVarianceRounded = roundDecimal(pooledVariance, 2)

var pooledSd = Math.sqrt(pooledVariance)

function updateVariance() {
    sd1 = standardDeviation(sample1)
    sd2 = standardDeviation(sample2)
    sd1Rounded = roundDecimal(sd1, 2)
    sd2Rounded = roundDecimal(sd2, 2)
    n1 = sample1.length
    n2 = sample2.length
    pooledVariance = (sd1Rounded ** 2 / n1) + (sd2Rounded ** 2 / n2)
    pooledVarianceRounded = roundDecimal(pooledVariance, 2)
    pooledSd = Math.sqrt(pooledVariance)

    // let weightedSd1String = String.raw`\[ \color[RGB]{106, 196, 222}{${sd1Rounded}^2 \over ${n1}} \]`
    // let weightedSd2String = String.raw`\[ \color[RGB]{118, 204, 47}{${sd2Rounded}^2 \over ${n2}} \]`
    let weightedSd1String = String.raw`\frac{${sd1Rounded}^2}{${n1}}`
    let weightedSd2String = String.raw`\frac{${sd2Rounded}^2}{${n2}}`
    let pooledVarExpression = String.raw`${weightedSd1String} + ${weightedSd2String}`
    document.getElementById("pooled-sd-pg")
        .innerHTML = String.raw`\[ \Large sd_{pooled} = ${pooledVarExpression} = \sqrt{${pooledVarianceRounded}} = ${roundDecimal(pooledSd, 2)}\]`
    MathJax.typesetPromise()
}

const nullDistrWidth = 500
const nullDistrHeight = 400
const nullDistrMargins = {
    "top": 50,
    "left": 30,
    "right": 10,
    "bottom": 40
}
    
const nullDistrSvg = d3.select("#null-distr-pg").append("svg")
    .attr("width", nullDistrWidth)
    .attr("height", nullDistrHeight)
const nullDistrData = generateNormalData(d3.range(-3, 3, 0.01), 0, pooledSd)

function partialNormalPdf(input) {
    return normalPdf(input, 0, pooledSd)
}

const [ nullXGraphValues, nullYGraphValues ] = drawDistribution(nullDistrSvg, nullDistrData, nullDistrWidth, nullDistrHeight, nullDistrMargins)
nullDistrSvg.append("text")
    .text("μ = 0")
    .attr("x", nullDistrWidth / 2)
    .attr("y", nullDistrMargins.top + 5)
nullDistrSvg.append("text")
    .text(`sd = ${roundDecimal(pooledSd, 2)}`)
    .attr("x", nullDistrWidth / 2)
    .attr("y", nullDistrMargins.top + 30)
nullDistrSvg.append("text")
    .attr("id", "mean-diff-text-null-distr")
    .text(`|x̄2 - x̄1| = ${roundDecimal(differenceInMeans, 2)}`)
    .attr("x", nullXGraphValues(differenceInMeans) + 10)
    .attr("y", nullDistrHeight - nullDistrMargins.bottom + 40)
nullDistrSvg.append("line")
    .attr("id", "mean-diff-tick-null-distr")
    .attr("x1", nullXGraphValues(differenceInMeans))
    .attr("x2", nullXGraphValues(differenceInMeans))
    .attr("y1", nullDistrHeight - nullDistrMargins.bottom + 10)
    .attr("y2", nullYGraphValues(partialNormalPdf(differenceInMeans)))
    .lower()

function updatePValue() {
    pValue = areaUnderCurve(partialNormalPdf, differenceInMeans, 3, 0.001)
    nullDistrSvg.selectAll("#pValue").remove()
    nullDistrSvg.selectAll("#p-value-area").remove()
    nullDistrSvg.selectAll("#mean-diff-tick-null-distr").remove()
    nullDistrSvg.selectAll("#mean-diff-text-null-distr").remove()
    nullDistrSvg.append("text")
        .attr("id", "pValue")
        .text(`p = ${roundDecimal(pValue, 3)}`)
        .attr("x", nullDistrWidth * (3/4))
        .attr("y", nullDistrHeight * (3/4))
    var nullDistrArea = d3.area()
        .x0((d) => {return nullXGraphValues(d.x)})
        .y0(nullDistrHeight - nullDistrMargins.bottom)
        .y1((d) => {return nullYGraphValues(d.y)})
    nullDistrSvg.append("path")
        .datum(nullDistrData.filter((d) => d.x >= differenceInMeans))
        .attr("id", "p-value-area")
        .attr("class", "area")
        .attr("d", nullDistrArea)
        .lower()
    nullDistrSvg.append("line")
        .attr("id", "mean-diff-tick-null-distr")
        .attr("x1", nullXGraphValues(differenceInMeans))
        .attr("x2", nullXGraphValues(differenceInMeans))
        .attr("y1", nullDistrHeight - nullDistrMargins.bottom + 10)
        .attr("y2", nullYGraphValues(partialNormalPdf(differenceInMeans)))
        .lower()
    console.log(partialNormalPdf(differenceInMeans))
    nullDistrSvg.append("text")
        .attr("id", "mean-diff-text-null-distr")
        .text(`|x̄2 - x̄1| = ${roundDecimal(differenceInMeans, 2)}`)
        .attr("x", nullXGraphValues(differenceInMeans) + 10)
        .attr("y", nullDistrHeight - nullDistrMargins.bottom + 40)
}

let pValue = areaUnderCurve(partialNormalPdf, differenceInMeans, 3, 0.001)
nullDistrSvg.append("text")
    .attr("id", "pValue")
    .text(`p = ${roundDecimal(pValue, 3)}`)
    .attr("x", nullDistrWidth * (3/4))
    .attr("y", nullDistrHeight * (3/4))
var nullDistrArea = d3.area()
    .x0((d) => {return nullXGraphValues(d.x)})
    .y0(nullDistrHeight - nullDistrMargins.bottom)
    .y1((d) => {return nullYGraphValues(d.y)})
nullDistrSvg.append("path")
    .datum(nullDistrData.filter((d) => d.x >= differenceInMeans))
    .attr("id", "p-value-area")
    .attr("class", "area")
    .attr("d", nullDistrArea)
    .lower()
d3.select("#conclusion").append("text")
    .text(`The probability of observing a difference of ${roundDecimal(differenceInMeans, 3)} or more is ${roundDecimal(pValue, 3)}.`)