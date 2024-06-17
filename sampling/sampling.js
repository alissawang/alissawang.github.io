import { generateNormalData, sampleNormalDistribution } from "../utils/data.js";
import { drawDistribution, emptyGraph } from "../utils/graph.js";
import { mean, standardDeviation } from "../utils/math.js"

const width = 700
const height = 400
const margins = ({
    top: 40,
    right: 80,
    bottom: 50,
    left: 80
})

const popDistrSvg = d3.select("#population-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

var popMean = 0.5
var popSd = 0.1
var sampleSize = 15

const xRange = d3.range(0, 1.01, .01)
const popData = generateNormalData(xRange, popMean, popSd)
const yRange = d3.extent(popData.map(d => d.y))
const [ popGraphXValues, popGraphYvalues ] = emptyGraph(popDistrSvg, xRange, yRange, width, height, margins)

var line = d3.line()
    .x(d => popGraphXValues(d.x))
    .y(d => popGraphYvalues(d.y))
popDistrSvg.append("path")
    .attr("class", "curve")
    .attr("id", "population-distribution")
    .data([popData])
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

var sample = sampleNormalDistribution(popMean, popSd, sampleSize).map(d => d.x)
var sampleMean = mean(sample)
var sampleSdRaw = standardDeviation(sample)
var sampleSdAdj = standardDeviation(sample, 1)
var sampleDistrRawSd = generateNormalData(xRange, sampleMean, sampleSdRaw)
var sampleDistrAdjSd = generateNormalData(xRange, sampleMean, sampleSdAdj)

popDistrSvg.append("path")
    .attr("class", "curve")
    .attr("id", "sampled-distribution-raw-sd")
    .data([sampleDistrRawSd])
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);
popDistrSvg.append("path")
    .attr("class", "curve")
    .attr("id", "sampled-distribution-adj-sd")
    .data([sampleDistrAdjSd])
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);