import { drawDistribution } from "../utils/graph.js"
import { generateData } from "../utils/data.js"

var margin = ({
    top: 40,
    right: 30,
    bottom: 70,
    left: 40
})
var width = 700
var height = 500

var introSvg = d3.select("#intro-graph").append("svg").attr("width", width).attr("height", height);
var nullHypothesisMu = 35
var nullHypothesisSd = 2
var nullHypothesisXmin = nullHypothesisMu - (5 * nullHypothesisSd)
var nullHypothesisXmax = nullHypothesisMu + (5 * nullHypothesisSd)
var introData = generateData(d3.range(nullHypothesisXmin, nullHypothesisXmax, 0.01), nullHypothesisMu, nullHypothesisSd)
drawDistribution(introSvg, introData, width, height, margin)
