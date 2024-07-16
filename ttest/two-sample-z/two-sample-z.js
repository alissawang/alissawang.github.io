import { seedSampleNormalDistribution, shuffleArray, forceArrayMean, generateNormalData } from "../../utils/data.js"
import { mean, standardDeviation, roundDecimal, zScore, normalPdf } from "../../utils/math.js"
import { addSquareRootSvg, empty1DGraph, drawDistribution } from "../../utils/graph.js"
import { animateSample, addFractionSvg, varianceTransition, highlightPArea } from "../utils.js"

var margin = ({
    top: 0,
    right: 30,
    bottom: 20,
    left: 150
})
var varianceMargins = {
    top: 0,
    right: 30,
    bottom: 20,
    left: 20
}
var normalDistrMargins = {
    "top": 80,
    "left": 30,
    "right": 10,
    "bottom": 40
}

var sampleWidth = 700
var sampleHeight = 200
var zWidth = 500
var zHeight = 230
var varianceSvgWidth = 400
var varianceSvgHeight = 500
var normalDistrWidth = 500
var normalDistrHeight = 400

var sampleGraphXRange = d3.range(0, 10, 0.01)
var sampleMean1 = 6.3
var sampleMean2 = 4.7
var n = 30
var diffInMeans = Math.abs(sampleMean1 - sampleMean2)
var nullDiffInMeans = 2.3
var sample1 = forceArrayMean(seedSampleNormalDistribution(sampleMean1, 1.8, n).map(d => d.x), sampleMean1).sort()
var sample2 = forceArrayMean(seedSampleNormalDistribution(sampleMean2, 1.2, n).map(d => d.x), sampleMean2).sort()
var sd1 = standardDeviation(sample1)
var sd2 = standardDeviation(sample2)
var z = zScore(nullDiffInMeans, diffInMeans, (sd1 / Math.sqrt(n)) + (sd2 / Math.sqrt(n)))
var normalXRange = d3.range(-6, 6, 0.01)
const normalDistrData = generateNormalData(normalXRange, 0, 1)
function normalPdfPartial(input) {
    return normalPdf(input, 0, 1)
}

const sampleSvg = d3.select("#samples").append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)
const zScoreSvg = d3.select("#z-score-compute")
    .append("svg")
    .attr("width", zWidth)
    .attr("height", zHeight)
const sample1VarianceSvg = d3.select("#sample-1-variance-visual").append("svg")
    .attr("width", varianceSvgWidth)
    .attr("height", varianceSvgHeight)
const sample2VarianceSvg = d3.select("#sample-2-variance-visual").append("svg")
    .attr("width", varianceSvgWidth)
    .attr("height", varianceSvgHeight)
const normalDistrSvg = d3.select("#normal-distribution")
    .append("svg")
    .attr("width", normalDistrWidth)
    .attr("height", normalDistrHeight)

const sampleXGraphValues = empty1DGraph(sampleSvg, sampleGraphXRange, sampleWidth, sampleHeight, margin)
const sampleOffset = 100
const sample1Height = margin.top + 40

sampleSvg.append("text")
    .text("Black & White")
    .attr("class", "x-axis-label")
    .attr("id", "group-1-label")
    .attr("x", 120)
    .attr("y", sample1Height)

sampleSvg.append("text")
    .text("Brown")
    .attr("class", "x-axis-label")
    .attr("x", 120)
    .attr("y", sample1Height + sampleOffset)

var zComputeX = 160;
var zComputeY = 120;
zScoreSvg.append("text").text("=").attr("x", zComputeX - 150).attr("y", zComputeY + 15).style("font-size", 40)
addFractionSvg(zScoreSvg, "z-score", `(${sampleMean1} - ${sampleMean2}) - ${nullDiffInMeans}`, "", zComputeX, zComputeY, 35)
addFractionSvg(zScoreSvg, "sd1", " sd₁ ", n, zComputeX - 60, zComputeY + 55, 30)
addFractionSvg(zScoreSvg, "sd2", " sd₂ ", n, zComputeX + 60, zComputeY + 55, 30)
addSquareRootSvg(zScoreSvg, zComputeX - 75, zComputeY + 68, n)
addSquareRootSvg(zScoreSvg, zComputeX + 45, zComputeY + 68, n)

zScoreSvg.append("text").text("+").attr("class", "denominator").attr("x", zComputeX).attr("y", zComputeY + 70).style("font-size", 40).style("text-anchor", "middle")
zScoreSvg.append("text").text(`= ${roundDecimal(z, 2)}`).attr("x", zComputeX + 130).attr("y", zComputeY + 15).style("font-size", 40)
zScoreSvg.append("text").text(`standard deviations from`).attr("x", zComputeX + 160).attr("y", zComputeY + 40).style("font-size", 12)
zScoreSvg.append("text").text(`null hypothesis mean`).attr("x", zComputeX + 160).attr("y", zComputeY + 55).style("font-size", 12)


const sample1VarianceValues = empty1DGraph(
    sample1VarianceSvg, 
    d3.extent(sampleGraphXRange), 
    varianceSvgWidth,
    60,
    varianceMargins
)
const sample2VarianceValues = empty1DGraph(
    sample2VarianceSvg, 
    d3.extent(sampleGraphXRange), 
    varianceSvgWidth,
    60,
    varianceMargins
)

const oneTailButton = document.querySelector("#one-tail-button")
const twoTailButton = document.querySelector("#two-tail-button")
var nTails = 1;
oneTailButton.addEventListener("click", () => {
    if (nTails != 1) {
        buttonFocus(oneTailButton);
        buttonRelease(twoTailButton);
    }
    nTails = 1;
    highlightPArea(
        normalDistrSvg, "normal-distr", normalDistrData, z, normalPdfPartial, normalXGraphValues, normalYGraphValues, normalDistrWidth, normalDistrHeight, normalDistrMargins, nTails
    );
})
twoTailButton.addEventListener("click", () => {
    if (nTails != 2) {
        buttonFocus(twoTailButton);
        buttonRelease(oneTailButton);
    }
    nTails = 2;
    highlightPArea(
        normalDistrSvg, "normal-distr", normalDistrData, z, normalPdfPartial, normalXGraphValues, normalYGraphValues, normalDistrWidth, normalDistrHeight, normalDistrMargins, nTails
    );
})

function buttonFocus(button) {
    if (!button.className.includes("active")) {
        button.className += " active"
    }
}

function buttonRelease(button) {
    button.className = button.className.replace(" active", "")
}


var [ normalXGraphValues, normalYGraphValues ] = drawDistribution(normalDistrSvg, normalDistrData, normalDistrWidth, normalDistrHeight, normalDistrMargins)
normalDistrSvg.append("text")
    .text(`z = ${roundDecimal(z, 2)}`)
    .attr("id", "normal-distr-z-text")
    .attr("x", normalXGraphValues(z))
    .attr("y", normalDistrHeight - 5)

normalDistrSvg.append("line")
    .attr("id", "normal-distr-p-line")
    .attr("x1", normalXGraphValues(z))
    .attr("x2", normalXGraphValues(z))
    .attr("y1", normalYGraphValues(normalPdfPartial(z)))
    .attr("y2", normalDistrHeight - normalDistrMargins.bottom)

function transitionSampleLines(){
    let delayScale = 40
    sampleSvg.append("line")
        .attr("id", "mean-1")
        .attr("class", "dynamic")
        .attr("x1", sampleXGraphValues(sampleMean1))
        .attr("x2", sampleXGraphValues(sampleMean1))
        .attr("y1", sample1Height + 8)
        .attr("y2", sample1Height + 8)
        .transition()
        .delay(delayScale*sample1.length)
        .attr("y2", sample1Height + 50)
    sampleSvg.append("text")
        .attr("id", "mean-1-text")
        .attr("class", "dynamic")
        .text(`x̄ = ${roundDecimal(sampleMean1, 2)}`)
        .attr("x", sampleXGraphValues(sampleMean1))
        .attr("y", sample1Height - 15)
        .style("opacity", "0%")
        .transition()
        .delay(delayScale*sample1.length)
        .style("opacity", "100%")
    sampleSvg.append("line")
        .attr("id", "mean-2")
        .attr("class", "dynamic")
        .attr("x1", sampleXGraphValues(sampleMean2))
        .attr("x2", sampleXGraphValues(sampleMean2))
        .attr("y1", sample1Height + sampleOffset + 8)
        .attr("y2", sample1Height + sampleOffset + 8)
        .transition()
        .delay(delayScale*sample2.length)
        .attr("y2", sample1Height + sampleOffset - 50)
    sampleSvg.append("text")
        .attr("id", "mean-2-text")
        .attr("class", "dynamic")
        .text(`x̄ = ${roundDecimal(sampleMean2, 2)}`)
        .attr("x", sampleXGraphValues(sampleMean2))
        .attr("y", sample1Height + sampleOffset + 25)
        .style("opacity", "0%")
        .transition()
        .delay(delayScale*sample2.length)
        .style("opacity", "100%")

    sampleSvg.append("line")
        .attr("id", "dim")
        .attr("class", "dynamic")
        .attr("x1", sampleXGraphValues(sampleMean1))
        .attr("x2", sampleXGraphValues(sampleMean1))
        .attr("y1", (sampleHeight / 2) - 10)
        .attr("y2", (sampleHeight / 2) - 10)
        .transition()
        .delay(delayScale * 1.5 * sample1.length)
        .attr("x2", sampleXGraphValues(sampleMean2))
    sampleSvg.append("text")
        .attr("id", "dim-text")
        .attr("class", "dynamic")
        .text(roundDecimal(diffInMeans, 2))
        .attr("x", sampleXGraphValues((sampleMean1 + sampleMean2) / 2))
        .attr("y", (sampleHeight / 2) - 20)
        .style("opacity", "0%")
        .transition()
        .delay(delayScale * 1.7 *sample2.length)
        .style("opacity", "100%")
}

export function page1Transition() {
    animateSample(sampleSvg, "sample-1", sampleXGraphValues, sample1Height, shuffleArray(sample1))
    animateSample(sampleSvg, "sample-2", sampleXGraphValues, sample1Height + sampleOffset, shuffleArray(sample2))    
    transitionSampleLines();
}

export function page1Reset() {
    sampleSvg.selectAll(".dynamic").remove()
}

export function page2Transition() {
    varianceTransition(sample1VarianceSvg, "sample-1-variance", sample1, sample1VarianceValues, varianceSvgHeight, varianceMargins)
    varianceTransition(sample2VarianceSvg, "sample-2-variance", sample2, sample2VarianceValues, varianceSvgHeight, varianceMargins)
    zScoreSvg.select("#sd1-numerator")
        .transition()
        .delay(40 * sample1.length)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
        .text(roundDecimal(sd1, 2))
    zScoreSvg.select("#sd2-numerator")
        .transition()
        .delay(40 * sample2.length)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
        .text(roundDecimal(sd2, 2))
}

export function page2Reset() {
    sample1VarianceSvg.selectAll(".dynamic").remove()
    sample2VarianceSvg.selectAll(".dynamic").remove()
    zScoreSvg.select("#sd1-numerator").text(" sd₁ ")
    zScoreSvg.select("#sd2-numerator").text(" sd₂ ")
}

export function page3Transition() {
    nTails = 1;
    buttonFocus(oneTailButton);
    buttonRelease(twoTailButton);
    highlightPArea(
        normalDistrSvg, "normal-distr", normalDistrData, z, normalPdfPartial, normalXGraphValues, normalYGraphValues, normalDistrWidth, normalDistrHeight, normalDistrMargins, nTails
    );
}