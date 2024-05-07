import { arraySampleDistribution } from "../utils/data.js"

var width = 700
var height = 500

var svg = d3.select('#sampled-graph').append("svg").attr("width", width).attr("height", height);
svg.append("g")

var histXRange = d3.range(0, 1, 0.05)
var histYRange = d3.range(0, 20)
var [graphXValues, graphYValues] = emptyGraph(svg, histXRange, histYRange, width, height, margins)

var samplingButton = document.querySelector("#sampling-button")
let samplingArray = []
let meanBins = d3.histogram()
    .domain(mainGraphXValues.domain())
    .thresholds(100)

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
            .attr("width", function(d) { return mainGraphXValues(d.x1) - mainGraphXValues(d.x0) - 0.4; })
            .attr("height", function(d) { return height2 - margins.bottom - mainGraphYValues(d.length); })
})
