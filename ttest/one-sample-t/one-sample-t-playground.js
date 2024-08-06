import { seedSampleNormalDistribution, forceArrayMean, sampleNormalDistribution } from "../../utils/data.js";
import { studentsTPdf, tScore, roundDecimal, areaUnderCurve, reverseLookupAreaUnderCurve } from "../../utils/math.js";
import { drawDistribution, empty1DGraph, addTextSvg, graphAreaUnderCurveFromPoint } from "../../utils/graph.js";
import { animateSample, addSquareRootSvg, highlightPArea } from "../utils.js";

const sampleWidth = 400;
const sampleHeight = 100;
const width = 600;
const height = 350;
const tScoreWidth = 230;
const tScoreHeight = 120;
const sampleMargins = ({
    top: 10,
    right: 30,
    bottom: 20,
    left: 10
})
const margins = ({
    top: 20,
    right: 20,
    bottom: 80,
    left: 20
})

var h0Mean = 5
var sampleMean = 5.5
var sd = 1
var n = 15
var dof = n - 1
var t = tScore(h0Mean, sampleMean, sd, n)
var alpha = 0.05
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
const alphaSlider = document.getElementById("alpha-slider")
const alphaSliderDisplay = document.getElementById("alpha-value")
const sdSlider = document.getElementById("sd-slider")
const sdSliderDisplay = document.getElementById("sd-value")
const meanSlider = document.getElementById("mean-slider")
const meanSliderDisplay = document.getElementById("mean-slider-value")
meanSlider.style.top = `${sampleHeight - 10}px`;
meanSliderDisplay.style.top = `${sampleHeight - 65}px`;
const oneTailButton = document.querySelector("#one-tail-button-pg")
const twoTailButton = document.querySelector("#two-tail-button-pg")
var nTails = 1;

initiateSlider(h0Mean, h0Slider, h0SliderDisplay)
initiateSlider(n, sampleSizeSlider, sampleSizeSliderDisplay)
initiateSlider(alpha, alphaSlider, alphaSliderDisplay)
initiateSlider(sampleMean, meanSlider, meanSliderDisplay, `x̅ = `)

meanSliderDisplay.style.left = `${scaleSliderValue(meanSlider.value)}px`;
graphNewSample(sampleSvg, sampleMean, n, sd)
var [ tGraphXValues, tGraphYValues ] = drawTDistribution(tDistrSvg, dof)
dfDisplay.innerHTML = `DF = ${dof}`;
sdSliderDisplay.innerHTML = sd;
displayTCalc(t)
graphPArea(tFunction, t, nTails)
graphAlpha()
buttonFocus(oneTailButton)

h0Slider.oninput = function() {
    h0Mean = parseFloat(this.value)
    h0SliderDisplay.innerHTML = h0Mean;
    d3.select("#t-score-hypothesized").text(h0Mean)
    updateTScore()
    displayTCalc()
    graphPArea(tFunction, t, nTails)
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
    graphPArea(tFunction, t, nTails)
}

sdSlider.oninput = function() {
    sd = parseFloat(this.value)
    sdSliderDisplay.innerHTML = sd;
    graphNewSample(sampleSvg, sampleMean, n, sd)
    updateMeanSlider()
    updateTScore()
    displayTCalc()
    graphPArea(tFunction, t, nTails)
}

meanSlider.oninput = function() {
    sampleMean = parseFloat(this.value)
    updateMeanSlider(sampleMean)
    d3.select("#t-score-observed").text(sampleMean)
    graphNewSample(sampleSvg, sampleMean, n, sd)
    updateTScore()
    displayTCalc()
    graphPArea(tFunction, t)
}

alphaSlider.oninput = function() {
    alpha = parseFloat(this.value)
    alphaSliderDisplay.innerHTML = alpha
    graphAlpha()
    graphPArea(tFunction, t, nTails)
}

oneTailButton.addEventListener("click", () => {
    if (nTails != 1) {
        buttonFocus(oneTailButton);
        buttonRelease(twoTailButton);
    }
    nTails = 1;
    graphPArea(tFunction, t, nTails);
    graphAlpha();
})

twoTailButton.addEventListener("click", () => {
    if (nTails != 2) {
        buttonFocus(twoTailButton);
        buttonRelease(oneTailButton);
    }
    nTails = 2;
    graphPArea(tFunction, t, nTails);
    graphAlpha();
})

function buttonFocus(button) {
    if (!button.className.includes("active")) {
        button.className += " active"
    }
}

function buttonRelease(button) {
    button.className = button.className.replace(" active", "")
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
    tDistrSvg.selectAll(".t-score-input").remove()
    let tScoreX = 50
    let tScoreY = 45
    addTextSvg(tScoreSvg, "=", tScoreX - 35, tScoreY + 10, "t-score-equals", "t-score-input")
    addTextSvg(tScoreSvg, sampleMean, tScoreX, tScoreY - 10, "t-score-observed", "t-score-input")
    addTextSvg(tScoreSvg, "-", tScoreX + 25, tScoreY - 10, "t-score-minus", "t-score-input")
    addTextSvg(tScoreSvg, h0Mean, tScoreX + 55, tScoreY - 10, "t-score-hypothesized", "t-score-input")
    tScoreSvg.append("line").attr("class", "frac-line").attr("x1", tScoreX - 15).attr("x2", tScoreX + 65).attr("y1", tScoreY + 5).attr("y2", tScoreY + 5)
    addTextSvg(tScoreSvg, sd, tScoreX + 20, tScoreY + 25, "t-score-sd", "t-score-input")
    tScoreSvg.append("line").attr("class", "frac-line").attr("x1", tScoreX).attr("x2", tScoreX + 40).attr("y1", tScoreY + 30).attr("y2", tScoreY + 30)
    addSquareRootSvg(tScoreSvg, tScoreX + 20, tScoreY + 35, n, 23, "t-score-sample-size")
    addTextSvg(tScoreSvg, "=", tScoreX + 95, tScoreY + 10, "t-score-equals", "t-score-input")
    addTextSvg(tScoreSvg, roundDecimal(t, 2), tScoreX + 140, tScoreY + 10, "t-score-value", "t-score-input")

    let graphTScoreX = t > 6 ? tGraphXValues(6) : (t < -6 ? tGraphXValues(-6) : tGraphXValues(t));
    let graphTScoreY = height - 20;
    addTextSvg(tDistrSvg, "t = ", graphTScoreX - 40, graphTScoreY, "t-equals", "t-score-input")
    addTextSvg(tDistrSvg, roundDecimal(t, 2), graphTScoreX, graphTScoreY, "t-score-value", "t-score-input")

    tDistrSvg.select("#t-score-slider").remove()
    tDistrSvg.append("rect")
        .attr("id", "t-score-slider")
        .style("fill", "steelblue")
        .attr("width", 5)
        .attr("height", 20)
        .attr("x", graphTScoreX)
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
        .attr("cy", (sampleHeight / 2) + 10)
}

function graphPArea(tFunction, t, nTails) {
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

    if (nTails == 2) {
        graphAreaUnderCurveFromPoint(
            tDistrSvg, 
            tFunction, 
            tDistrXRange, 
            -t, 
            tGraphXValues, 
            tGraphYValues, 
            height, 
            margins, 
            "p", 
            ""
        )
    }

    let calcPStart = (t > 0) ? t : d3.extent(tDistrXRange)[0]
    let calcPEnd = (t > 0) ? d3.extent(tDistrXRange)[1] : t
    let p = areaUnderCurve(tFunction, calcPStart, calcPEnd, 0.01)
    if (nTails == 2) {
        p = p * 2
    }
    if (p <= alpha) {
        tDistrSvg.selectAll("#p-area")
            .style("fill", "red")
    }
    tDistrSvg.append("text")
        .text(`p = ${roundDecimal(p, 3)}`)
        .attr("id", "p-value-text")
        .attr("x", tGraphXValues(t) + 30)
        .attr("y", tGraphYValues(tFunction(t)) - 10)
}

function graphAlpha() {
    let targetArea = nTails == 1? alpha : alpha / 2
    let criticalValue = reverseLookupAreaUnderCurve(tFunction, d3.extent(tDistrXRange)[1], 0.01, targetArea)
    tDistrSvg.selectAll("#graph-alpha").remove()
    tDistrSvg.selectAll("#graph-alpha-line").remove()
    tDistrSvg.append("text")
        .text(`α = ${alpha}`)
        .attr("id", "graph-alpha")
        .attr("x", tGraphXValues(criticalValue))
        .attr("y", height - margins.bottom + 35)
    tDistrSvg.append("line")
        .attr("id", "graph-alpha-line")
        .attr("x1", tGraphXValues(criticalValue))
        .attr("x2", tGraphXValues(criticalValue))
        .attr("y1", height - margins.bottom)
        .attr("y2", tGraphYValues(tFunction(criticalValue)))
    if (nTails == 2) {
        tDistrSvg.append("line")
        .attr("id", "graph-alpha-line")
        .attr("x1", tGraphXValues(-criticalValue))
        .attr("x2", tGraphXValues(-criticalValue))
        .attr("y1", height - margins.bottom)
        .attr("y2", tGraphYValues(tFunction(-criticalValue)))
    }
}