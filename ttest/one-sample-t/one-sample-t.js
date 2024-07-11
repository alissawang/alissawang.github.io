import { addFractionSvg, highlightPArea } from "../utils.js"
import { empty1DGraph, drawDistribution, addLegend, addSquareRootSvg } from "../../utils/graph.js"
import { generateNormalData, seedSampleNormalDistribution, shuffleArray, forceArrayMean } from "../../utils/data.js"
import { mean, standardDeviation, roundDecimal, studentsTPdf, tScore, areaUnderCurve } from "../../utils/math.js"

const margins = ({
    top: 0,
    right: 30,
    bottom: 20,
    left: 80
})

const nullDistrMargins = {
    "top": 80,
    "left": 30,
    "right": 10,
    "bottom": 40
}

var sampleWidth = 400
var sampleHeight = 100
var tWidth = 400
var tHeight = 250
var nullDistrWidth = 500
var nullDistrHeight = 400

var sampleMean = 7
var nullDistrMean = 6.3
var n = 15
var sd = 2
var sampleXRange = d3.range(0, 15, 0.01)
var nullXRange = d3.range(-6, 6, 0.01)
var sample = forceArrayMean(seedSampleNormalDistribution(sampleMean, sd, n).map(d => d.x), sampleMean).sort((a, b) => a - b)
var sampleSd = standardDeviation(sample)
var t = tScore(nullDistrMean, sampleMean, sampleSd, n)

const sampleSvg = d3.select("#sample")
    .append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)
const tDistrSvg = d3.select("#t-distributions")
    .append("svg")
    .attr("width", nullDistrWidth)
    .attr("height", nullDistrHeight)
const tScoreSvg = d3.select("#t-score-compute")
    .append("svg")
    .attr("width", tWidth)
    .attr("height", tHeight)
const nullDistrSvg = d3.select("#null-distribution")
    .append("svg")
    .attr("width", nullDistrWidth)
    .attr("height", nullDistrHeight)

const sampleXGraphValues = empty1DGraph(sampleSvg, sampleXRange, sampleWidth, sampleHeight, margins)
const circleY = sampleHeight - margins.bottom - 20

const dataDf1 = nullXRange.map(d => {return {"x": d, "y": studentsTPdf(d, 1)}})
const dataDf3 = nullXRange.map(d => {return {"x": d, "y": studentsTPdf(d, 3)}})
const dataDfSample = nullXRange.map(d => {return {"x": d, "y": studentsTPdf(d, n - 1)}})
function selectedTPdf(x) {
    return studentsTPdf(x, n - 1)
}
const graphedDFs = [1, 3, 14]

drawDistribution(tDistrSvg, dataDf1, nullDistrWidth, nullDistrHeight, nullDistrMargins, {"yExtent": [0, 0.4], "class": "df-curve", "id": "df-curve-1"})
drawDistribution(tDistrSvg, dataDf3, nullDistrWidth, nullDistrHeight, nullDistrMargins, {"yExtent": [0, 0.4], "class": "df-curve", "id": "df-curve-2"})
const [ tGraphXValues, tGraphYValues ] = drawDistribution(tDistrSvg, dataDfSample, nullDistrWidth, nullDistrHeight, nullDistrMargins, {"yExtent": [0, 0.4], "class": "df-curve", "id": "df-curve-3"})
const colors = ["pink", "#8ecf1f", "#6bbfe3"]
addLegend(tDistrSvg, colors, graphedDFs, nullDistrWidth - nullDistrMargins.right - 120, margins.top + 40)
tDistrSvg.append("text")
    .attr("class", "graph-title")
    .text("Student's t-distributions")
    .style("text-anchor", "middle")
    .attr("x", nullDistrWidth / 2)
    .attr("y", 20)
const tSlider = document.getElementById("t-slider")
const tValue = document.getElementById("t-value")
tSlider.oninput = function() {
    let t = parseFloat(this.value)
    tValue.innerHTML = `t = ${t}`;
    tValue.style.left = `${(t + 6) * 41}px`
    highlightPArea(tDistrSvg, "t-distr", dataDfSample, parseFloat(tSlider.value), selectedTPdf, tGraphXValues, tGraphYValues, nullDistrWidth, nullDistrHeight, nullDistrMargins, 1)
}
highlightPArea(tDistrSvg, "t-distr", dataDfSample, parseFloat(tSlider.value), selectedTPdf, tGraphXValues, tGraphYValues, nullDistrWidth, nullDistrHeight, nullDistrMargins, 1)

tScoreSvg.append("text").text("=").attr("x", 30).attr("y", 90).style("font-size", 40)
addFractionSvg(tScoreSvg, "t-score", `${sampleMean} - ${nullDistrMean}`, `${roundDecimal(sampleSd, 2)}`, 150, 79, 35)
tScoreSvg.append("line")
    .attr("class", "frac-line")
    .attr("x1", 150 - 30)
    .attr("x2", 150 + 30)
    .attr("y1", tHeight / 2 + 5)
    .attr("y2", tHeight / 2 + 5)
addSquareRootSvg(tScoreSvg, 150 - 10, tHeight - 110, n, 35)
tScoreSvg.append("text").text(`= ${roundDecimal(t, 2)}`).attr("x", tWidth - 160).attr("y", 90).style("font-size", 40)

const varianceSvgWidth = 400
const varianceSvgHeight = 300
const varianceGraphHeight = 240
const sampleVarianceSvg = d3.select("#variance").append("svg")
    .attr("width", varianceSvgWidth)
    .attr("height", varianceSvgHeight)
const sampleVarianceValues = empty1DGraph(
    sampleVarianceSvg, 
    d3.extent(sample), 
    varianceSvgWidth,
    60,
    margins
)

sampleVarianceSvg.selectAll("#sample-values")
    .data(sample)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("id", "sample-values")
    .attr("cx", d => sampleVarianceValues(d))
    .attr("cy", margins.top + 30)
sampleVarianceSvg.append("line")
    .attr("id", "mean-line-variance")
    .attr("x1", sampleVarianceValues(sampleMean))
    .attr("x2", sampleVarianceValues(sampleMean))
    .attr("y1", varianceGraphHeight)
    .attr("y2", margins.top + 30)
sampleVarianceSvg.append("text")
    .text(`x̄ = ${roundDecimal(sampleMean, 2)}`)
    .attr("id", "sample-variance-mean-text")
    .attr("x", sampleVarianceValues(sampleMean))
    .attr("y", 10)
const sampleVarianceGraph = sample.map((d, idx) => { return {"x": d, "y": 70 + (idx * 12)}})

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
        nullDistrSvg, "null-distr", dataDfSample, t, selectedTPdf, nullXGraphValues, nullYGraphValues, nullDistrWidth, nullDistrHeight, nullDistrMargins, nTails
    );
})
twoTailButton.addEventListener("click", () => {
    if (nTails != 2) {
        buttonFocus(twoTailButton);
        buttonRelease(oneTailButton);
    }
    nTails = 2;
    highlightPArea(
        nullDistrSvg, "null-distr", dataDfSample, t, selectedTPdf, nullXGraphValues, nullYGraphValues, nullDistrWidth, nullDistrHeight, nullDistrMargins, nTails
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

const [ nullXGraphValues, nullYGraphValues ] = drawDistribution(nullDistrSvg, dataDfSample, nullDistrWidth, nullDistrHeight, nullDistrMargins)
nullDistrSvg.append("text")
    .text(`t = ${roundDecimal(t, 2)}`)
    .attr("id", "null-tscore-text")
    .attr("x", nullXGraphValues(t))
    .attr("y", nullDistrHeight - 5)
nullDistrSvg.append("text")
    .attr("id", "graph-title")
    .text(`Student's t: df = 14`)
    .style("text-anchor", "middle")
    .attr("x", nullXGraphValues(0))
    .attr("y", nullDistrMargins.top - 20)

function animateSample(dataArray) {
    for (let i = 0; i < dataArray.length; i++) {
        let point = dataArray[i];
        setTimeout(function() {
            sampleSvg
                .append("circle")
                .attr("r", 8)
                .attr("id", "sample-values")
                .attr("cx", sampleXGraphValues(point))
                .attr("cy", 0)
                .transition()
                .ease(d3.easeLinear)
                .duration(40)
                .attr("cy", circleY)
        }, i * 40)
    }

    sampleSvg.append("line")
        .transition()
        .delay(40 * sample.length)
        .attr("id", "mean-line")
        .attr("x1", sampleXGraphValues(sampleMean))
        .attr("x2", sampleXGraphValues(sampleMean))
        .attr("y1", circleY - 10)
        .attr("y2", circleY - 20)
        .style("stroke", "steelblue")
    sampleSvg.append("text")
        .transition()
        .delay(40 * sample.length)
        .attr("id", "mean-text")
        .text(`x̄ = ${roundDecimal(sampleMean, 2)}`)
        .style("text-anchor", "middle")
        .attr("x", sampleXGraphValues(sampleMean))
        .attr("y", circleY - 20)
        .style("fill", "steelblue")
}

function varianceTransition() {
    sampleVarianceSvg.selectAll("#temporary-circle-highlight")
        .data(sampleVarianceGraph)
        .enter()
        .append("circle")
        .attr("id", "temporary-circle-highlight")
        .attr("class", "dynamic")
        .attr("r", 8)
        .attr("cx", d => sampleVarianceValues(d.x))
        .attr("cy", margins.top + 30)
        .style("fill", "#2f7182")
        .transition()
        .style("fill", "transparent")
    sampleVarianceSvg.selectAll("#sample-var-points")
        .data(sampleVarianceGraph)
        .enter()
        .append("circle")
        .attr("id", "sample-var-points")
        .attr("class", "dynamic")
        .attr("r", 8)
        .attr("cx", d => sampleVarianceValues(d.x))
        .attr("cy", d => margins.top + 30)
        .transition()
        .delay(50)
        .ease(d3.easeLinear)
        .duration(500)
        .attr("cy", d => d.y)

    for (let i = 0; i < sampleVarianceGraph.length; i++) {
        let point = sampleVarianceGraph[i];
        setTimeout(function() {
                sampleVarianceSvg.append("line")
                .attr("id", "sample-var-diffs")
                .attr("class", "dynamic")
                .attr("x1", sampleVarianceValues(point.x) + ((point.x > 10) ? -8 : 8))
                .attr("x2", sampleVarianceValues(point.x) + ((point.x > 10) ? -8 : 8))
                .attr("y1", point.y)
                .attr("y2", point.y)
                .transition()
                .delay(500)
                .duration(100)
                .attr("x2", sampleVarianceValues(sampleMean))
        }, i * 20)
    }

    setTimeout(function () {
        sampleVarianceSvg.append("text")
            .text(`standard deviation = ${roundDecimal(sampleSd, 2)}`)
            .attr("class", "dynamic")
            .attr("id", "sample-sd-text")
            .attr("x", sampleVarianceValues(sampleMean))
            .attr("y", varianceGraphHeight + 35)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 100)
        sampleVarianceSvg.append("line")
            .attr("id", "sample-sd-line")
            .attr("class", "dynamic")
            .attr("x1", sampleVarianceValues(sampleMean - (sampleSd / 2)))
            .attr("x2", sampleVarianceValues(sampleMean + (sampleSd / 2)))
            .attr("y1", varianceGraphHeight + 50)
            .attr("y2", varianceGraphHeight + 50)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 100)
        sampleVarianceSvg.append("line")
            .attr("id", "sample-sd-line")
            .attr("class", "dynamic")
            .attr("x1", sampleVarianceValues(sampleMean - (sampleSd / 2)))
            .attr("x2", sampleVarianceValues(sampleMean - (sampleSd / 2)))
            .attr("y1", varianceGraphHeight + 45)
            .attr("y2", varianceGraphHeight + 55)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 100)
        sampleVarianceSvg.append("line")
            .attr("id", "sample-sd-line")
            .attr("class", "dynamic")
            .attr("x1", sampleVarianceValues(sampleMean + (sampleSd / 2)))
            .attr("x2", sampleVarianceValues(sampleMean + (sampleSd / 2)))
            .attr("y1", varianceGraphHeight + 45)
            .attr("y2", varianceGraphHeight + 55)
            .style("opacity", 0)
            .transition()
            .duration(500)
            .style("opacity", 100)
    }, 40 * sample.length)
}


export function page1Transition() {
    animateSample(shuffleArray(sample));
}

export function page1Reset() {
    sampleSvg.selectAll("circle").remove();
}

export function page2Transition() {
    tDistrSvg.select("#df-curve-1")
        .transition()
        .delay(500)
        .style("stroke", "#e8e8e8")
    tDistrSvg.select("#df-curve-2")
        .transition()
        .delay(500)
        .style("stroke", "#e8e8e8")
    let t = parseFloat(tSlider.value)
    tValue.innerHTML = `t = ${t}`;
    tValue.style.left = `${(tSlider.value + 6) * 41}px`
}

export function page2Reset() {
    sampleVarianceSvg.selectAll(".dynamic").remove();
    tDistrSvg.select("#df-curve-1")
        .style("stroke", colors[0])
        .style("opacity", "100%")
    tDistrSvg.select("#df-curve-2")
        .style("stroke", colors[1])
        .style("opacity", "100%")
    tSlider.value = 6;
    tValue.innerHTML = `t = ${tSlider.value}`;
    tValue.style.left = `${(tSlider.value + 6) * 41}px`
}

export function page3Transition() {
    varianceTransition();
    tScoreSvg.select("#t-score-denominator")
        .transition()
        .delay(40 * sample.length)
        .style("fill", "#54a4ba")
}

export function page3Reset() {
    tScoreSvg.select("#t-score-denominator")
        .style("fill", "black")
}

export function page4Transition() {
    nTails = 1;
    buttonFocus(oneTailButton);
    buttonRelease(twoTailButton);
    highlightPArea(
        nullDistrSvg, "null-distr", dataDfSample, t, selectedTPdf, nullXGraphValues, nullYGraphValues, nullDistrWidth, nullDistrHeight, nullDistrMargins, nTails
    );
}