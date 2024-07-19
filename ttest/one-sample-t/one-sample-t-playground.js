import { seedSampleNormalDistribution, forceArrayMean, sampleNormalDistribution } from "../../utils/data.js";
import { studentsTPdf, tScore, roundDecimal, areaUnderCurve } from "../../utils/math.js";
import { drawDistribution, empty1DGraph, addTextSvg, graphAreaUnderCurveFromPoint } from "../../utils/graph.js";
import { animateSample, addSquareRootSvg } from "../utils.js";

const sampleWidth = 400;
const sampleHeight = 100;
const width = 700;
const height = 300;
const tScoreWidth = width;
const tScoreHeight = 80;
const sampleMargins = ({
    top: 10,
    right: 30,
    bottom: 20,
    left: 80
})
const margins = ({
    top: 10,
    right: 180,
    bottom: 80,
    left: 80
})

var h0Mean = 5
var sampleMean = 5.5
var sd = 1
var n = 15
var dof = n - 1
var t = tScore(h0Mean, sampleMean, sd, n)
const sampleSvg = d3.select("#sample-pg")
    .append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)
const tDistrSvg = d3.select("#t-distribution")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const tScoreSvg = d3.select("#t-score")
    .append("svg")
    .attr("width", tScoreWidth)
    .attr("height", tScoreHeight)
const dfDisplay = document.getElementById("df-display")
const sampleXRange = d3.range(0, 10.01, 0.01)
const tDistrXRange = d3.range(-6, 6, 0.01)
const sampleXGraphValues = empty1DGraph(sampleSvg, sampleXRange, sampleWidth, sampleHeight, sampleMargins)

function scaleSliderValue(value) {
    return 65 + (value * 28)
}

const h0Slider = document.getElementById("h0-slider")
const h0SliderDisplay = document.getElementById("h0-value")
const sampleSizeSlider = document.getElementById("sample-size-slider")
const sampleSizeSliderDisplay = document.getElementById("sample-size-value")
const sdSlider = document.getElementById("sd-slider")
const sdSliderDisplay = document.getElementById("sd-value")
const meanSlider = document.getElementById("mean-slider")
const meanSliderDisplay = document.getElementById("mean-slider-value")

initiateSlider(h0Mean, h0Slider, h0SliderDisplay)
initiateSlider(n, sampleSizeSlider, sampleSizeSliderDisplay)
initiateSlider(sampleMean, meanSlider, meanSliderDisplay, `x̅ = `)

meanSliderDisplay.style.left = `${scaleSliderValue(meanSlider.value)}px`;
graphNewSample(sampleSvg, sampleMean, n, sd)
var [ tGraphXValues, tGraphYValues ] = drawTDistribution(tDistrSvg, dof)
dfDisplay.innerHTML = `DF = ${dof}`;
sdSliderDisplay.innerHTML = sd;
displayTCalc(t)
graphPArea(tFunction, t)

h0Slider.oninput = function() {
    h0Mean = parseFloat(this.value)
    h0SliderDisplay.innerHTML = h0Mean;
    d3.select("#t-score-hypothesized").text(h0Mean)
    updateTScore()
    displayTCalc()
    graphPArea(tFunction, t)
}

sampleSizeSlider.oninput = function() {
    n = parseFloat(this.value)
    dof = n - 1
    sampleSizeSliderDisplay.innerHTML = n;
    graphNewSample(sampleSvg, sampleMean, n, sd)
    updateMeanSlider()
    drawTDistribution(tDistrSvg, dof)
    dfDisplay.innerHTML = `DF = ${dof}`
    updateTScore()
    displayTCalc()
    graphPArea(tFunction, t)
}

sdSlider.oninput = function() {
    sd = parseFloat(this.value)
    sdSliderDisplay.innerHTML = sd;
    graphNewSample(sampleSvg, sampleMean, n, sd)
    updateMeanSlider()
    updateTScore()
    displayTCalc()
    graphPArea(tFunction, t)
}

meanSlider.oninput = function() {
    sampleMean = parseFloat(this.value)
    updateMeanSlider(sampleMean)
    d3.select("#t-score-observed").text(sampleMean)
    graphNewSample(sampleSvg, sampleMean, n, sd)
    updateTScore()
    displayTCalc()
}

function tFunction(x) {
    return studentsTPdf(x, dof)
}

function updateMeanSlider() {
    meanSliderDisplay.innerHTML = `x̅ = ${sampleMean}`;
    meanSliderDisplay.style.left = `${scaleSliderValue(sampleMean)}px`
}

function updateTScore() {
    t = tScore(h0Mean, sampleMean, sd, n)
    d3.select("#t-score-value").text(roundDecimal(t, 2))
}

function displayTCalc() {
    tScoreSvg.selectAll(".t-score-input").remove()
    tScoreSvg.selectAll(".denominator").remove()
    tScoreSvg.selectAll(".frac-line").remove()
    tScoreSvg.select("#t-slider").remove()
    let tScoreX = t > 6 ? tGraphXValues(6) : (t < -6 ? tGraphXValues(-6) : tGraphXValues(t));
    let tScoreY = 15;
    addTextSvg(tScoreSvg, "t = ", tScoreX - 40, tScoreY + 10, "t-equals", "t-score-input")
    addTextSvg(tScoreSvg, sampleMean, tScoreX, tScoreY, "t-score-observed", "t-score-input")
    addTextSvg(tScoreSvg, "-", tScoreX + 25, tScoreY, "t-score-minus", "t-score-input")
    addTextSvg(tScoreSvg, h0Mean, tScoreX + 50, tScoreY, "t-score-hypothesized", "t-score-input")
    tScoreSvg.append("line").attr("class", "frac-line").attr("x1", tScoreX - 5).attr("x2", tScoreX + 55).attr("y1", tScoreY + 5).attr("y2", tScoreY + 5)
    addTextSvg(tScoreSvg, sd, tScoreX + 20, tScoreY + 25, "t-score-sd", "t-score-input")
    tScoreSvg.append("line").attr("class", "frac-line").attr("x1", tScoreX).attr("x2", tScoreX + 40).attr("y1", tScoreY + 30).attr("y2", tScoreY + 30)
    addSquareRootSvg(tScoreSvg, tScoreX + 15, tScoreY + 35, n, 20, "t-score-sample-size")
    addTextSvg(tScoreSvg, "=", tScoreX + 70, tScoreY + 10, "t-score-equals", "t-score-input")
    addTextSvg(tScoreSvg, roundDecimal(t, 2), tScoreX + 100, tScoreY + 10, "t-score-value", "t-score-input")

    tDistrSvg.select("#t-score-slider").remove()
    tDistrSvg.append("rect")
        .attr("id", "t-score-slider")
        .style("fill", "steelblue")
        .attr("width", 5)
        .attr("height", 20)
        .attr("x", tScoreX)
        .attr("y", height - margins.bottom - 10)
}

function drawTDistribution(svg, dof) {
    svg.selectAll("path").remove()
    let graphData = tDistrXRange.map(d => {return {"x": d, "y": tFunction(d)}})
    let [ tGraphXValues, tGraphYValues ] = drawDistribution(svg, graphData, width, height, margins, {"yExtent": [0, 0.45]})
    return [ tGraphXValues, tGraphYValues ]
}

function initiateSlider(initValue, sliderElement, valueElement, display="") {
    sliderElement.value = initValue;
    valueElement.innerHTML = `${display}${initValue}`
}

function graphNewSample(svg, sampleMean, n, sd) {
    let sampleData = forceArrayMean(sampleNormalDistribution(sampleMean, sd, n).map(d => d.x), sampleMean)
    svg.selectAll("#sample-pg-points").remove()
    svg.selectAll("#sample-pg-points")
        .data(sampleData)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("id", `sample-pg-points`)
        .attr("class", "dynamic")
        .attr("cx", d => sampleXGraphValues(d))
        .attr("cy", sampleHeight / 2)
}

function graphPArea(tFunction, t) {
    tDistrSvg.selectAll("#p-area").remove()
    tDistrSvg.selectAll("#p-value-text").remove()
    graphAreaUnderCurveFromPoint(
        tDistrSvg, 
        tFunction, 
        tDistrXRange, 
        t, 
        tGraphXValues, 
        tGraphYValues, 
        height, 
        margins, 
        "p", 
        ""
    )

    let calcPStart = (t > 0) ? t : d3.extent(tDistrXRange)[0]
    let calcPEnd = (t > 0) ? d3.extent(tDistrXRange)[1] : t
    let p = areaUnderCurve(tFunction, calcPStart, calcPEnd, 0.01)
    tDistrSvg.append("text")
        .text(`p = ${roundDecimal(p, 3)}`)
        .attr("id", "p-value-text")
        .attr("x", tGraphXValues(t) + 30)
        .attr("y", tGraphYValues(tFunction(t)) - 10)
}