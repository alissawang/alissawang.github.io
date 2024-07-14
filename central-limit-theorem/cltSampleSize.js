import { drawDistribution, drawBarGraph, emptyGraph } from "../utils/graph.js"
import { betaPdf, bernoulliPdf, uniformPdf, mean, sum } from "../utils/math.js"
import { arraySampleDistribution } from "../utils/data.js"

class distributionGraph {
    constructor(xRange, dataArray, pdf, svg, graphXValues, graphYValues) {
        this.xRange = xRange
        this.dataArray = dataArray
        this.pdf = pdf
        this.svg = svg
        this.graphXValues = graphXValues
        this.graphYValues = graphYValues
    }

    clear() {
        this.svg.style("outline", "none")
        this.svg.selectAll("circle").remove()
    }
}

var margins = ({
    top: 40,
    right: 30,
    bottom: 70,
    left: 40
})
var width = 300
var height = 250
var width2 = 600
var height2 = 450

var alpha = 2
var beta = 14
var betaXRange = d3.range(0, 1, 0.001)
var uniformXRange = d3.range(0, 1.1, 0.1)
var betaDataArray = betaXRange.map(function(d) {return {"x": d, "y": betaPdf(d, alpha, beta)}})
var uniformDataArray = uniformXRange.map(function(d) {return {"x": d, "y": uniformPdf(d, alpha, beta)}})

var bernoulliXRange = [0, 1]
var bernoulliDataArray = bernoulliXRange.map(function(d) {return {"x": d, "y": bernoulliPdf(d, 0.3)}})

const selectionColor = "#7cd3eb"
var betaSvg = d3.select('#beta-graph-page2')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", `thin solid ${selectionColor}`)
    .on("click", function() {
        selectedDistribution.clear()
        sampleSizeSvg.selectAll("rect").remove()
        selectedDistribution = betaGraph
        d3.select(this).style("outline", `thin solid ${selectionColor}`)
        scrubber.value = 1
        scrubberValue.innerHTML = "1"
        plotSampleMeans(sampleSizeSvg)
    });

var uniSvg = d3.select('#uniform-graph-page2')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "none")
    .on("click", function() {
        selectedDistribution.clear()
        sampleSizeSvg.selectAll("rect").remove()
        selectedDistribution = uniformGraph
        d3.select(this).style("outline", `thin solid ${selectionColor}`)
        scrubber.value = 1
        scrubberValue.innerHTML = 1
        plotSampleMeans(sampleSizeSvg)
    });

var bernoulliSvg = d3.select('#bernoulli-graph-page2')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "none")
    .on("click", function() {
        selectedDistribution.clear()
        sampleSizeSvg.selectAll("rect").remove()
        selectedDistribution = bernoulliGraph
        d3.select(this).style("outline", `thin solid ${selectionColor}`)
        scrubber.value = 1
        scrubberValue.innerHTML = 1
        plotSampleMeans(sampleSizeSvg)
    });

var [betaGraphXValues, betaGraphYValues] = drawDistribution(betaSvg, betaDataArray, width, height, margins, {})
var [uniformGraphXValues, uniformGraphYValues] = drawDistribution(uniSvg, uniformDataArray, width, height, margins, {})
var [bernoulliGraphXValues, bernoulliGraphYValues] = drawBarGraph(bernoulliSvg, bernoulliDataArray, 1, width, height, margins)

const betaMean = alpha / (alpha + beta)
const uniformMean = mean(d3.extent(uniformXRange))
const bernoulliMean = sum(bernoulliDataArray.map(d => d.x * d.y))

var betaGraph = new distributionGraph(
    betaXRange, betaDataArray, betaPdf, betaSvg, betaGraphXValues, betaGraphYValues
)
var uniformGraph = new distributionGraph(
    uniformXRange, uniformDataArray, uniformPdf, uniSvg, uniformGraphXValues, uniformGraphYValues
)
var bernoulliGraph = new distributionGraph(
    bernoulliXRange, bernoulliDataArray, bernoulliPdf, bernoulliSvg, bernoulliGraphXValues, bernoulliGraphYValues
)

const scrubber = document.getElementById("sample-size-scrubber")
const scrubberValue = document.getElementById("sample-size-value")
scrubberValue.innerHTML = scrubber.value
scrubber.oninput = function() {
    let valueSampleSize = parseFloat(this.value)
    scrubberValue.innerHTML = valueSampleSize;
    plotSampleMeans(sampleSizeSvg);
}

var sampleSizeSvg = d3.select('#sample-size-graph').append("svg").attr("width", width2).attr("height", height2);
var [sampleSizeGraphXValues, sampleSizeGraphYValues] = emptyGraph(sampleSizeSvg, d3.range(0, 1, 0.1), d3.range(0, 300), width2, height2, margins)
function drawSample() {
    let sampledPoints = arraySampleDistribution(selectedDistribution.dataArray, scrubber.value)
    let sampledX = sampledPoints.map(d => d.x)
    return mean(sampledX)
}

var selectedDistribution = betaGraph
plotSampleMeans(sampleSizeSvg)

function plotSampleMeans(svg) {
    svg.selectAll("rect").remove()
    let meansArray = d3.range(1000).map(drawSample)
    let meanBins = d3.histogram()
        .domain(sampleSizeGraphXValues.domain())
        .thresholds(100)
    let sampleSizeMeanBins = meanBins(meansArray)
    svg.selectAll("rect").remove()
    svg.selectAll("rect")
        .data(sampleSizeMeanBins)
        .enter()
        .append("rect")
            .attr("id", "sample-hist-rects")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + sampleSizeGraphXValues(d.x0) + "," + sampleSizeGraphYValues(d.length) + ")"; })
            .attr("width", function(d) { return sampleSizeGraphXValues(d.x1) - sampleSizeGraphXValues(d.x0) - 0.4; })
            .attr("height", function(d) { return height2 - margins.bottom - sampleSizeGraphYValues(d.length); })
}