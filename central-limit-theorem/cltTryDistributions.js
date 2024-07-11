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

    clear() {
        this.svg.style("outline", "none")
        this.svg.selectAll("circle").remove()
        this.svg.select("#sample-mean-text").remove()
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
var width = 300
var height = 250
var width2 = 700
var height2 = 500

const selectionColor = "#7cd3eb"
var betaSvg = d3.select('#beta-graph')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", `thin solid ${selectionColor}`)
    .on("click", function() {
        selectedDistribution.clear()
        sampleMeansSvg.selectAll("rect").remove()
        samplingArray = []
        selectedDistribution = betaGraph
        d3.select(this).style("outline", `thin solid ${selectionColor}`)
    });

var uniSvg = d3.select('#uniform-graph')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "none")
    .on("click", function() {
        selectedDistribution.clear()
        sampleMeansSvg.selectAll("rect").remove()
        samplingArray = []
        selectedDistribution = uniformGraph
        d3.select(this).style("outline", `thin solid ${selectionColor}`)
    });

var bernoulliSvg = d3.select('#bernoulli-graph')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("outline", "none")
    .on("click", function() {
        selectedDistribution.clear()
        sampleMeansSvg.selectAll("rect").remove()
        samplingArray = []
        selectedDistribution = bernoulliGraph
        d3.select(this).style("outline", `thin solid ${selectionColor}`)
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
        
var selectedDistribution = betaGraph;

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
    selectedDistribution.svg.selectAll("#sample-mean").remove()
    selectedDistribution.svg.selectAll("#sample-mean-text").remove()

    if (selectedDistribution == bernoulliGraph) {
        let sampleClass0 = sampledPoints.filter(d => d.x == 0).length
        let sampleClass1 = sampledPoints.filter(d => d.x == 1).length
        let sampledPoints0 = d3.range(0, sampleClass0).map((idx) => {
            let row = Math.floor(idx/5)
            return {"x": 0.17 + (0.05 * (idx - row * 5)), "y": 0.06 + (row * 0.09)}
        })
        let sampledPoints1 = d3.range(0, sampleClass1).map((idx) => {
            let row = Math.floor(idx/5)
            return {"x": 0.62 + (0.05 * (idx - row * 5)), "y": 0.06 + (row * 0.09)}
        })

        let xGraphValues = d3.scaleLinear()
            .domain([0, 1])
            .range([margins.left, width - margins.right])
        let yGraphValues = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margins.bottom, margins.top])
    
        selectedDistribution.svg.append("g")
            .attr("transform", `translate(0,${height - margins.bottom})`)
            .call(d3.axisBottom(xGraphValues).tickValues([]));
        selectedDistribution.svg.append("g")
            .attr("transform", `translate(${margins.left},0)`)
            .call(d3.axisLeft(yGraphValues).tickValues([]))

        selectedDistribution.svg.selectAll("#class0")
            .data(sampledPoints0)
            .enter()
            .append("circle")
            .attr("class", "sampled-points")
            .attr("id", "class0")
            .attr("r", "5.7")
            .attr("cx", d => xGraphValues(d.x))
            .attr("cy", d => yGraphValues(d.y))
        selectedDistribution.svg.selectAll("#class1")
            .data(sampledPoints1)
            .enter()
            .append("circle")
            .attr("class", "sampled-points")
            .attr("id", "class1")
            .attr("r", "5.7")
            .attr("cx", d => xGraphValues(d.x))
            .attr("cy", d => yGraphValues(d.y))
    } else {
        plottedPoints
            .data(sampledPoints)
            .enter()
            .append("circle")
            .attr("class", "sampled-points")
            .attr("r", "7")
            .attr("cx", d => selectedDistribution.graphXValues(d.x))
            .attr("cy", d => selectedDistribution.graphYValues(d.y))

        selectedDistribution.svg.append("circle")
            .attr("id", "sample-mean")
            .attr("r", "7")
            .attr("cx", d => selectedDistribution.graphXValues(sampleMean))
            .attr("cy", d => selectedDistribution.graphYValues(selectedDistribution.pdf(sampleMean, alpha, beta)))
    }

    selectedDistribution.svg.append("text")
        .attr("id", "sample-mean-text")
        .attr("x", width / 2)
        .attr("y", height - (margins.bottom / 3))
        .attr("text-anchor", "middle")
        .text(`x̄ = ${Math.round(sampleMean * 100, 2) / 100}`)

    sampleMeansSvg.selectAll("rect").remove()
    sampleMeansSvg.selectAll("rect")
        .data(sampleMeanBins)
        .enter()
        .append("rect")
            .attr("id", "sample-hist-rects")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + mainGraphXValues(d.x0) + "," + mainGraphYValues(d.length) + ")"; })
            .attr("width", function(d) { return mainGraphXValues(d.x1) - mainGraphXValues(d.x0) - 0.4; })
            .attr("height", function(d) { return height2 - margins.bottom - mainGraphYValues(d.length); })    
})