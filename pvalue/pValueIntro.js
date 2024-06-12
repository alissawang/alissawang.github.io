import { empty1DGraph, drawDistribution } from "../utils/graph.js"
import { generateNormalData } from "../utils/data.js"

var margin = ({
    top: 40,
    right: 30,
    bottom: 70,
    left: 40
})
var width = 700
var height = 500

var sampleWidth = 400
var sampleHeight = 100

const sample1 = [35, 34.8, 35.2, 34, 36, 32, 39, 31]
const sample1Svg = d3.select("#sample-1").append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)

const sample1XGraphValues = empty1DGraph(sample1Svg, d3.range(30, 41, 1), sampleWidth, sampleHeight, margin)
sample1Svg.selectAll("#sample-values-1")
    .data(sample1)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("id", "sample-values-1")
    .attr("cx", d => sample1XGraphValues(d))
    .attr("cy", sampleHeight - margin.bottom - 10)

var introSvg = d3.select("#intro-graph").append("svg").attr("width", width).attr("height", height);
var nullHypothesisMu = 35
var nullHypothesisSd = 2
var nullHypothesisXmin = nullHypothesisMu - (5 * nullHypothesisSd)
var nullHypothesisXmax = nullHypothesisMu + (5 * nullHypothesisSd)
var introData = generateNormalData(d3.range(nullHypothesisXmin, nullHypothesisXmax, 0.01), nullHypothesisMu, nullHypothesisSd)
drawDistribution(introSvg, introData, width, height, margin)
