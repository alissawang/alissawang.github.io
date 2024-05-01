import { mean, betaPdf } from "../utils/math.js"
import { drawDistribution, emptyGraph } from "../utils/graph.js"
import { arraySampleDistribution } from "../utils/data.js"

var xStep = 0.001
var xRange = d3.range(0, 1, 0.001)
var alpha = 14
var beta = 4
var dataArray = xRange.map(function(d) {return {"x": d, "y": betaPdf(d, alpha, beta)}})

var margins = ({
    top: 40,
    right: 30,
    bottom: 70,
    left: 40
})
var width1 = 400
var height1 = 300
var width2 = 700
var height2 = 500

var svg1 = d3.select('#beta-graph').append("svg").attr("width", width1).attr("height", height1);
svg1.append("g")

var svg2 = d3.select('#sampled-graph').append("svg").attr("width", width2).attr("height", height2);
svg2.append("g")

var [betaGraphXValues, betaGraphYValues] = drawDistribution(svg1, dataArray, width1, height1, margins, false)
var histXRange = d3.range(0.6, 1, 0.05)
var histYRange = d3.range(0, 15)
var [mainGraphXValues, mainGraphYValues] = emptyGraph(svg2, histXRange, histYRange, width2, height2, margins)


var samplingButton = document.querySelector("#sampling-button")
let samplingArray = []
let meanBins = d3.histogram()
    .domain(mainGraphXValues.domain())
    .thresholds(50)

samplingButton.addEventListener("click", () => {
    let sampledPoints = arraySampleDistribution(dataArray, 30)
    let sampledX = sampledPoints.map(d => d.x)
    let sampleMean = mean(sampledX)

    samplingArray.push(sampleMean)
    var sampleMeanBins = meanBins(samplingArray)

    var plottedPoints = svg1.selectAll(".sampled-points")
        .data([sampledPoints])
    plottedPoints.exit().remove()

    var plottedMean = svg1.selectAll(".sample-mean")
        .data(sampleMean)
    plottedMean.exit().remove()

    var newPlottedPoints = plottedPoints
        .data(sampledPoints)
        .enter()
        .append("circle")
        .attr("class", "sampled-points")
        .style("fill", "steelblue")
        .attr("r", "7")
        .attr("cx", d => betaGraphXValues(d.x))
        .attr("cy", d => betaGraphYValues(d.y))

    svg1.append("circle")
        .attr("class", "sample-mean")
        .attr("fill", "green")
        .attr("r", "7")
        .attr("cx", d => betaGraphXValues(sampleMean))
        .attr("cy", d => betaGraphYValues(betaPdf(sampleMean, alpha, beta)))

    svg2.selectAll("rect")
        .data([sampleMeanBins]).exit().remove()
    svg2.selectAll("rect")
        .data(sampleMeanBins)
        .enter()
        .append("rect")
            .style("fill", "green")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + mainGraphXValues(d.x0) + "," + mainGraphYValues(d.length) + ")"; })
            .attr("width", function(d) { return mainGraphXValues(d.x1) - mainGraphXValues(d.x0); })
            .attr("height", function(d) { return height2 - margins.bottom - mainGraphYValues(d.length); })
})

