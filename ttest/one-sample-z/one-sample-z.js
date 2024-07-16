import { empty1DGraph, drawDistribution, addSquareRootSvg } from "../../utils/graph.js"
import { generateNormalData, seedSampleNormalDistribution, shuffleArray, forceArrayMean } from "../../utils/data.js"
import { mean, standardDeviation, roundDecimal, normalPdf, areaUnderCurve, zScore } from "../../utils/math.js"
import { highlightPArea, addFractionSvg } from "../utils.js"

const margins = ({
    top: 0,
    right: 30,
    bottom: 20,
    left: 80
})

const normalDistrMargins = {
    "top": 80,
    "left": 30,
    "right": 10,
    "bottom": 40
}

var sampleWidth = 400
var sampleHeight = 100
var zWidth = 400
var zHeight = 200
var normalDistrWidth = 500
var normalDistrHeight = 400

var sampleMean = 7
var nullHypothesisMean = 6.3
var n = 30
var sd = 2
var sampleXRange = d3.range(0, 15, 0.01)
var sample = forceArrayMean(seedSampleNormalDistribution(sampleMean, sd, n).map(d => d.x), sampleMean).sort((a, b) => a - b)
var sampleSd = standardDeviation(sample)
var z = zScore(nullHypothesisMean, sampleMean, sampleSd)
var normalXRange = d3.range(-6, 6, 0.01)
const normalDistrData = generateNormalData(normalXRange, 0, 1)
function normalPdfPartial(input) {
    return normalPdf(input, 0, 1)
}

const sampleSvg = d3.select("#sample")
    .append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)
const zScoreSvg = d3.select("#z-score-compute")
    .append("svg")
    .attr("width", zWidth)
    .attr("height", zHeight)
const normalDistrDynamicSvg = d3.select("#normal-distribution-dynamic")
    .append("svg")
    .attr("width", normalDistrWidth)
    .attr("height", normalDistrHeight)
const normalDistrSvg = d3.select("#normal-distribution")
    .append("svg")
    .attr("width", normalDistrWidth)
    .attr("height", normalDistrHeight)

const sampleXGraphValues = empty1DGraph(sampleSvg, sampleXRange, sampleWidth, sampleHeight, margins)
const circleY = sampleHeight - margins.bottom - 20
var [ normalXGraphValues, normalYGraphValues ] = drawDistribution(normalDistrDynamicSvg, normalDistrData, normalDistrWidth, normalDistrHeight, normalDistrMargins)
drawDistribution(normalDistrSvg, normalDistrData, normalDistrWidth, normalDistrHeight, normalDistrMargins)

const zSlider = document.getElementById("z-slider")
const zValue = document.getElementById("z-value")
zSlider.oninput = function() {
    let z = parseFloat(this.value)
    zValue.innerHTML = `z = ${z}`;
    zValue.style.left = `${(z + 6) * 41}px`
    highlightPArea(normalDistrDynamicSvg, "normal-distribution", normalDistrData, z, normalPdfPartial, normalXGraphValues, normalYGraphValues, normalDistrWidth, normalDistrHeight, normalDistrMargins, 1)
}

zScoreSvg.append("text").text("=").attr("x", 30).attr("y", 90).style("font-size", 40)
addFractionSvg(zScoreSvg, "z-score", `${sampleMean} - ${nullHypothesisMean}`, `sd`, 150, 79, 35)
zScoreSvg.append("text").text(`= ${roundDecimal(z, 2)}`).attr("x", zWidth - 160).attr("y", 90).style("font-size", 40)

const varianceSvgWidth = 400
const varianceSvgHeight = 500
const varianceGraphHeight = 420
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

normalDistrSvg.append("text")
    .text(`z = ${roundDecimal(z, 2)}`)
    .attr("id", "normal-distr-z-text")
    .attr("x", normalXGraphValues(z))
    .attr("y", normalDistrHeight - 5)

normalDistrSvg.append("line")
    .attr("id", "normal-distr-z-line")
    .attr("x1", normalXGraphValues(z))
    .attr("x2", normalXGraphValues(z))
    .attr("y1", normalYGraphValues(normalPdfPartial(z)))
    .attr("y2", normalDistrHeight - normalDistrMargins.bottom)

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
        .attr("id", "mean-line")
        .attr("class", "dynamic")
        .style("stroke", "steelblue")
        .attr("x1", sampleXGraphValues(sampleMean))
        .attr("x2", sampleXGraphValues(sampleMean))
        .attr("y1", circleY - 10)
        .attr("y2", circleY - 10)
        .transition()
        .delay(40 * sample.length + 400)
        .ease(d3.easeLinear)
        .attr("y2", circleY - 20)
    sampleSvg.append("text")
        .attr("id", "mean-text")
        .attr("class", "dynamic")
        .text(`x̄ = ${roundDecimal(sampleMean, 2)}`)
        .attr("x", sampleXGraphValues(sampleMean))
        .attr("y", circleY - 20)
        .style("opacity", "0%")
        .transition()
        .delay(40 * sample.length + 400)
        .style("fill", "steelblue")
        .style("opacity", "100%")
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
    sampleSvg.selectAll(".dynamic").remove();
}

export function page2Transition() {
    varianceTransition();
    zScoreSvg.select("#z-score-denominator")
        .transition()
        .delay(40 * (sample.length - 1))
        .style("opacity", "0%")
        .transition()
        .duration(100)
        .style("opacity", "100%")
        .text(roundDecimal(sampleSd, 2))
}

export function page2Reset() {
    sampleVarianceSvg.selectAll(".dynamic").remove();
    zScoreSvg.select("#z-score-denominator")
        .text("sd")
}

export function page3Transition() {
    nTails = 1;
    buttonFocus(oneTailButton);
    buttonRelease(twoTailButton);
    highlightPArea(
        normalDistrSvg, "normal-distr", normalDistrData, z, normalPdfPartial, normalXGraphValues, normalYGraphValues, normalDistrWidth, normalDistrHeight, normalDistrMargins, nTails
    );
}