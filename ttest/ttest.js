import { drawNormalDistribution } from "../utils/graph.js"
import { addFractionSvg } from "./utils.js"

const width = 300
const height = 230
const margins = {
    top: 60,
    left: 30,
    right: 30,
    bottom: 80
}
const criteriaWidth = 330
const criteriaHeight = 40
const xRangeZ = d3.range(-1, 1, 0.01)
const xRangeT = d3.range(-1.5, 1.5, 0.01)
const exampleMean = 0
const ztestSD = 0.2
const ttestSD = 0.45
const oneSampleZSvg = d3.select("#one-sample-z-test")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const oneSampleZCritSvg = d3.select("#one-sample-z-criteria")
    .append("svg")
    .attr("width", criteriaWidth)
    .attr("height", criteriaHeight)
const oneSampleTCritSvg = d3.select("#one-sample-t-criteria")
    .append("svg")
    .attr("width", criteriaWidth)
    .attr("height", criteriaHeight)
const oneSampleTSvg = d3.select("#one-sample-t-test")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
// const oneSampleBranchSvg = d3.select("#one-sample-branches")
//     .append("svg")
//     .attr("width", 800)
//     .attr("height", 300)
const twoSampleZSvg = d3.select("#two-sample-z-test")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const twoSamplePairedSvg = d3.select("#two-sample-paired-test")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const twoSampleUnpairedSvg = d3.select("#two-sample-unpaired-test")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const twoSampleZCritSvg = d3.select("#two-sample-z-criteria")
    .append("svg")
    .attr("width", criteriaWidth)
    .attr("height", criteriaHeight)
const twoSamplePairedCritSvg = d3.select("#two-sample-paired-criteria")
    .append("svg")
    .attr("width", criteriaWidth)
    .attr("height", criteriaHeight)
const twoSampleUnpairedCritSvg = d3.select("#two-sample-unpaired-criteria")
    .append("svg")
    .attr("width", criteriaWidth)
    .attr("height", criteriaHeight)

oneSampleZCritSvg.append("text")
    .text("KNOWN POPULATION VARIANCE")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15)
    .attr("class", "criteria-text")
oneSampleZCritSvg.append("text")
    .text("OR N ≥ 30")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15 + 20)
    .attr("class", "criteria-text")
oneSampleTCritSvg.append("text")
    .text("N ≤ 30")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15)
    .attr("class", "criteria-text")
twoSampleZCritSvg.append("text")
    .text("N₁ > 30 AND N₂ > 30")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15)
    .attr("class", "criteria-text")
twoSamplePairedCritSvg.append("text")
    .text("2 RELATED GROUPS")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15)
    .attr("class", "criteria-text")
twoSamplePairedCritSvg.append("text")
    .text("OR SAME GROUP AT DIFFERENT TIMES")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15 + 20)
    .attr("class", "criteria-text")
twoSampleUnpairedCritSvg.append("text")
    .text("INDEPENDENT GROUPS")
    .attr("x", criteriaWidth / 2)
    .attr("y", 15)
    .attr("class", "criteria-text")

// oneSampleBranchSvg.append("line")
//     .style("stroke", "black")
//     .attr("x1", 465)
//     .attr("x2", 465)
//     .attr("y1", 0)
//     .attr("y2", 800)

drawNormalDistribution(oneSampleZSvg, xRangeZ, exampleMean, ztestSD, width, height - 10, margins, {"hideXAxis": true, "hideYAxis": true, "class": "example-curve"})
drawNormalDistribution(oneSampleTSvg, xRangeT, exampleMean, ttestSD, width, height - 30, margins, {"hideXAxis": true, "hideYAxis": true, "class": "example-curve"})
drawNormalDistribution(twoSampleZSvg, xRangeZ, exampleMean, ztestSD, width, height - 10, margins, {"hideXAxis": true, "hideYAxis": true, "class": "example-curve"})
drawNormalDistribution(twoSamplePairedSvg, xRangeT, exampleMean, ttestSD, width, height - 30, margins, {"hideXAxis": true, "hideYAxis": true, "class": "example-curve"})
drawNormalDistribution(twoSampleUnpairedSvg, xRangeT, exampleMean, ttestSD, width, height - 30, margins, {"hideXAxis": true, "hideYAxis": true, "class": "example-curve"})

testInfo(oneSampleZSvg, "Z-TEST", width, height, "one-sample-z", "√Σ(x-x̄)²", "n", (width / 2) - 60, 25)
testInfo(oneSampleTSvg, "T-TEST", width, height, "one-sample-t", "√Σ(x-x̄)²", "n - 1", (width / 2) - 60, 25)
testInfo(twoSampleZSvg, "Z-TEST", width, height, "two-sample-z-group1", "√Σ(x₁-x̄₁)²", "n₁", (width / 2) - 110, 20)
addFractionSvg(twoSampleZSvg, "two-sample-z-group2", "√Σ(x₂-x̄₂)²", "n₂", (width / 2) + 90, height - margins.bottom + 50, 20)
twoSampleZSvg.append("text")
    .text("+")
    .attr("class", "math-symbol")
    .attr("x", 170)
    .attr("y", height - margins.bottom + 50)
    .style("font-size", 25)
testInfo(twoSamplePairedSvg, "PAIRED T-TEST", width, height, "two-sample-paired", "√Σ(x̄₁₋₂-μ₁₋₂)²", "n - 1", (width / 2) - 60, 20)
testInfo(twoSampleUnpairedSvg, "UNPAIRED T-TEST", width, height, "two-sample-unpaired", "√(Σ(n₁-1)×sd₁² + Σ(n₂-1)×sd₂²)", "√(n₁ - 1 + n₂ - 1)", (width / 2) - 60, 20)

function testInfo(svg, title, width, height, id, numerator, denominator, x, fontSize) {
    let maxChars = d3.max([String(numerator).length, String(denominator).length])
    svg.append("text")
        .text(title)
        .attr("class", "svg-text")
        .attr("x", width / 2)
        .attr("y", 25)
    svg.append("text")
        .text("σ = ")
        .attr("class", "math-symbol")
        .attr("x", x - (3 * maxChars))
        .attr("y", height - margins.bottom + 50)
    addFractionSvg(
        svg, 
        id, 
        numerator, 
        denominator, 
        x + 65 + (1.6 * maxChars), 
        height - margins.bottom + 50, 
        fontSize
    )        
}

function addFractionSvg(svg, id, numerator, denominator, x, y, fontSize) {
    let maxChars = d3.max([String(numerator).length, String(denominator).length])
    svg.append("text")
        .attr("id", `${id}-numerator`)
        .attr("class", "frac-text")
        .style("font-size", fontSize)
        .style("text-anchor", "middle")
        .text(numerator)
        .attr("x", x)
        .attr("y", y - 10)
    svg.append("line")
        .attr("id", `${id}-frac-line`)
        .attr("class", "frac-line")
        .attr("x1", x - (fontSize * (maxChars * 0.2)))
        .attr("x2", x + (fontSize * (maxChars * 0.2)))
        .attr("y1", y)
        .attr("y2", y)
    svg.append("text")
        .attr("id", `${id}-denominator`)
        .attr("class", "frac-text")
        .style("font-size", fontSize)
        .style("text-anchor", "middle")
        .text(denominator)
        .attr("x", x)
        .attr("y", y + (fontSize * 0.9))
}