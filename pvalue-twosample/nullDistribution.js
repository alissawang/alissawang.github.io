import { generateNormalData } from "../utils/data.js"
import { drawDistribution } from "../utils/graph.js"

const width = 500
const height = 400
const margins = {
    "top": 10,
    "left": 20,
    "right": 10,
    "bottom": 20
}

const nullDistrSvg = d3.select("#null-distribution").append("svg")
    .attr("width", width)
    .attr("height", height)
const nullDistrData = generateNormalData(d3.range(-3, 3, 0.1), 0, 0.54)

const [ nullXGraphValues, nullYGraphValues ] = drawDistribution(nullDistrSvg, nullDistrData, width, height, margins)
nullDistrSvg.append("text")