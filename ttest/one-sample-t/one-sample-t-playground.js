import { seedSampleNormalDistribution, forceArrayMean, sampleNormalDistribution, constrainValue } from "../../utils/data.js";
import { studentsTPdf, tScore, roundDecimal, areaUnderCurve, reverseLookupAreaUnderCurve } from "../../utils/math.js";
import { drawDistribution, empty1DGraph, addTextSvg, graphAreaUnderCurveFromPoint } from "../../utils/graph.js";
import { animateSample, addSquareRootSvg, highlightPArea } from "../utils.js";

const sampleWidth = 400;
const sampleHeight = 40;
const width = 480;
const height = 280;
const sampleMargins = ({
    top: 0,
    right: 50,
    bottom: 20,
    left: 50
})
const margins = ({
    top: 15,
    right: 55,
    bottom: 80,
    left: 40
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
const tScoreSvg = d3.select("#t-score-display")
    .append("svg")
    .attr("width", 150)
    .attr("height", 130)
const dfDisplay = document.getElementById("df-display")
const tScoreContainer = document.getElementById("t-score-container")
const sampleXRange = d3.range(0, 10.01, 0.01)
const tDistrXRange = d3.range(-6, 6, 0.01)
const sampleXGraphValues = empty1DGraph(sampleSvg, sampleXRange, sampleWidth, sampleHeight, sampleMargins)

function scaleSliderValue(value) {
    return 30 + (value * 30)
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
meanSlider.style.top = `${sampleHeight}px`;
meanSliderDisplay.style.top = `${sampleHeight - 50}px`;
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
    graphAlpha()
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
    graphAlpha()
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
    tScoreSvg.selectAll("line").remove()
    tScoreSvg.selectAll("#t-score-sample-size").remove()
    tDistrSvg.selectAll("#t-score-triangle").remove()
    tDistrSvg.selectAll("#t-score-slider-display").remove()

    let tScoreX = 45
    let tScoreY = 53
    addTextSvg(tScoreSvg, "=", tScoreX - 35, tScoreY + 10, "t-score-equals", "t-score-input")
    addTextSvg(tScoreSvg, sampleMean, tScoreX, tScoreY - 10, "t-score-observed", "t-score-input")
    addTextSvg(tScoreSvg, "-", tScoreX + 25, tScoreY - 10, "t-score-minus", "t-score-input")
    addTextSvg(tScoreSvg, h0Mean, tScoreX + 55, tScoreY - 10, "t-score-hypothesized", "t-score-input")
    tScoreSvg.append("line").attr("class", "t-score-frac-line").attr("x1", tScoreX - 15).attr("x2", tScoreX + 65).attr("y1", tScoreY + 5).attr("y2", tScoreY + 5)
    addTextSvg(tScoreSvg, sd, tScoreX + 25, tScoreY + 30, "t-score-sd", "t-score-input")
    tScoreSvg.append("line").attr("class", "t-score-frac-line").attr("x1", tScoreX + 2).attr("x2", tScoreX + 48).attr("y1", tScoreY + 35).attr("y2", tScoreY + 35)
    addSquareRootSvg(tScoreSvg, tScoreX + 22, tScoreY + 43, n, 23, "t-score-sample-size")

    let graphTScoreX = t > 6 ? tGraphXValues(6) : (t < -6 ? tGraphXValues(-6) : tGraphXValues(t));
    let graphTScoreY = height - margins.bottom + 60;
    addTextSvg(tDistrSvg, `t = ${roundDecimal(t, 2)}`, graphTScoreX - 40, graphTScoreY, "t-score-slider-display")
    tScoreContainer.style.marginLeft = `${70 + graphTScoreX}px`
    var triangle = d3.symbol()
        .type(d3.symbolTriangle)
        .size(80)
    tDistrSvg.append("path")
        .attr("id", "t-score-triangle")
        .attr("d", triangle)
        .attr("transform", `translate(${graphTScoreX},${height- margins.bottom + 75})`)

    tDistrSvg.select("#t-score-slider").remove()
    tDistrSvg.append("rect")
        .attr("id", "t-score-slider")
        .style("fill", "#6bbfe3")
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
        .attr("cy", (sampleHeight / 2) - 10)
}

function graphPArea(tFunction, t, nTails) {
    tDistrSvg.selectAll("#p-area").remove()
    tDistrSvg.selectAll("#p-value-text").remove()
    tDistrSvg.selectAll("#conclusion-text").remove()
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
            .style("fill", "#d67e7e")
            .style("opacity", "100%")
    }
    let conclusion = (p <= alpha) ? "Reject" : "Fail to reject"
    let conclusionColor = (p <= alpha) ? "#c44545" : "#6bbfe3"
    
    let pXOffset = t > 0 ? 30 : -90
    let pX = constrainValue(tGraphXValues(t) + pXOffset, margins.left + 10, width - margins.right - 60)
    tDistrSvg.append("text")
        .text(`p = ${roundDecimal(p, 3)}`)
        .attr("id", "p-value-text")
        .attr("x", pX)
        .attr("y", tGraphYValues(tFunction(t)) - 10)
    tDistrSvg.append("text")
        .text(`${conclusion} h0`)
        .attr("id", "conclusion-text")
        .style("fill", conclusionColor)
        .attr("x", tGraphXValues(0))
        .attr("y", margins.top)
}

function graphAlpha() {
    let targetArea = nTails == 1? alpha : alpha / 2
    let criticalValue = reverseLookupAreaUnderCurve(tFunction, d3.extent(tDistrXRange)[1], 0.01, targetArea)
    if (sampleMean < h0Mean) {
        criticalValue *= -1
    }
    tDistrSvg.selectAll("#graph-alpha").remove()
    tDistrSvg.selectAll("#graph-alpha-line").remove()
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