import { mean, betaPdf, uniformPdf, bernoulliPdf } from "../utils/math.js"
import { drawDistribution, emptyGraph, drawBarGraph } from "../utils/graph.js"
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
}

var xRange = d3.range(0, 1, 0.001)
var alpha = 2
var beta = 14
var betaDataArray = xRange.map(function(d) {return {"x": d, "y": betaPdf(d, alpha, beta)}})
var uniformDataArray = xRange.map(function(d) {return {"x": d, "y": uniformPdf(d, alpha, beta)}})

var bernoulliXRange = [0, 1]
var bernoulliDataArray = bernoulliXRange.map(function(d) {return {"x": d, "y": bernoulliPdf(d, 0.3)}})

var margins = ({
    top: 40,
    right: 30,
    bottom: 70,
    left: 40
})
var width = 400
var height = 300
var width2 = 700
var height2 = 500

var betaSvg = d3.select('#beta-graph')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "thin solid steelblue")
    .on("click", function() {
        d3.select(this).style("outline", "thin solid steelblue")
        selectedDistribution.svg.style("outline", "none")
        selectedDistribution.svg.selectAll("circle")
            .data([]).exit().remove()
        sampleMeansSvg.selectAll("rect")
            .data([]).exit().remove()
        samplingArray = []
        selectedDistribution = betaGraph
    });

var uniSvg = d3.select('#uniform-graph')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "none")
    .on("click", function() {
        d3.select(this).style("outline", "thin solid steelblue")
        selectedDistribution.svg.style("outline", "none")
        selectedDistribution.svg.selectAll("circle")
            .data([]).exit().remove()
        sampleMeansSvg.selectAll("rect")
            .data([]).exit().remove()
        samplingArray = []
        selectedDistribution = uniformGraph
    });

var bernoulliSvg = d3.select('#bernoulli-graph')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "none")
    .on("click", function() {
        d3.select(this).style("outline", "thin solid steelblue")
        selectedDistribution.svg.style("outline", "none")
        selectedDistribution.svg.selectAll("circle")
            .data([]).exit().remove()
        sampleMeansSvg.selectAll("rect")
            .data([]).exit().remove()
        samplingArray = []
        selectedDistribution = bernoulliGraph
    });

var [betaGraphXValues, betaGraphYValues] = drawDistribution(betaSvg, betaDataArray, width, height, margins, false)
var [uniformGraphXValues, uniformGraphYValues] = drawDistribution(uniSvg, uniformDataArray, width, height, margins, false)
var [bernoulliGraphXValues, bernoulliGraphYValues] = drawBarGraph(bernoulliSvg, bernoulliDataArray, 1, width, height, margins)


var betaGraph = new distributionGraph(
    xRange, betaDataArray, betaPdf, betaSvg, betaGraphXValues, betaGraphYValues
)
var uniformGraph = new distributionGraph(
    xRange, uniformDataArray, uniformPdf, uniSvg, uniformGraphXValues, uniformGraphYValues
)
var bernoulliGraph = new distributionGraph(
    bernoulliXRange, bernoulliDataArray, bernoulliPdf, bernoulliSvg, bernoulliGraphXValues, bernoulliGraphYValues
)
        
var selectedDistribution = betaGraph

var sampleMeansSvg = d3.select('#sampled-graph').append("svg").attr("width", width2).attr("height", height2);

var histXRange = d3.range(0, 1, 0.05)
var histYRange = d3.range(0, 20)
var [mainGraphXValues, mainGraphYValues] = emptyGraph(sampleMeansSvg, histXRange, histYRange, width2, height2, margins, 2)


var samplingButton = document.querySelector("#sampling-button")
let samplingArray = []
let meanBins = d3.histogram()
    .domain(mainGraphXValues.domain())
    .thresholds(100)

samplingButton.addEventListener("mousedown", () => {
    let sampledPoints = arraySampleDistribution(selectedDistribution.dataArray, 30)
    let sampledX = sampledPoints.map(d => d.x)
    let sampleMean = mean(sampledX)

    samplingArray.push(sampleMean)
    var sampleMeanBins = meanBins(samplingArray)

    var plottedPoints = selectedDistribution.svg.selectAll(".sampled-points")
        .data([sampledPoints])
    plottedPoints.exit().remove()

    var plottedMean = selectedDistribution.svg.selectAll(".sample-mean")
        .data(sampleMean)
    plottedMean.exit().remove()

    var newPlottedPoints = plottedPoints
        .data(sampledPoints)
        .enter()
        .append("circle")
        .attr("class", "sampled-points")
        .style("fill", "steelblue")
        .attr("r", "7")
        .attr("cx", d => selectedDistribution.graphXValues(d.x))
        .attr("cy", d => selectedDistribution.graphYValues(d.y))

    selectedDistribution.svg.append("circle")
        .attr("class", "sample-mean")
        .attr("fill", "green")
        .attr("r", "7")
        .attr("cx", d => selectedDistribution.graphXValues(sampleMean))
        .attr("cy", d => selectedDistribution.graphYValues(selectedDistribution.pdf(sampleMean, alpha, beta)))

    sampleMeansSvg.selectAll("rect")
        .data([sampleMeanBins]).exit().remove()
    sampleMeansSvg.selectAll("rect")
        .data(sampleMeanBins)
        .enter()
        .append("rect")
            .style("fill", "green")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + mainGraphXValues(d.x0) + "," + mainGraphYValues(d.length) + ")"; })
            .attr("width", function(d) { return mainGraphXValues(d.x1) - mainGraphXValues(d.x0) - 0.4; })
            .attr("height", function(d) { return height2 - margins.bottom - mainGraphYValues(d.length); })
})

