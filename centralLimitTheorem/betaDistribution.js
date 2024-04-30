import { mean, betaPdf } from "../utils/math.js"
import { drawDistribution, emptyGraph } from "../utils/graph.js"
import { randomSample, randomChoice } from "../utils/data.js"

var xRange = d3.range(0, 1, 0.001)
var alpha = 8
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
var sampleXRange = dataArray.map(d => d.x)
var sampleYRange = dataArray.map(d => d.y)
var [mainGraphXValues, mainGraphYValues] = emptyGraph(svg2, sampleXRange, sampleYRange, width2, height2, margins)

var samplingButton = document.querySelector("#sampling-button")
samplingButton.addEventListener("click", () => {
    // let rand = randomChoice()
    let sampledPoints = randomSample(dataArray, 10)
    let sampledX = sampledPoints.map(d => d.x)
    let sampleMean = mean(sampledX)

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

    svg2.append("circle")
        .attr("class", "sample-mean")
        .attr("fill", "green")
        .attr("r", "10")
        .attr("cx", d => mainGraphXValues(sampleMean))
        .attr("cy", d => mainGraphYValues(betaPdf(sampleMean, alpha, beta)))
})

