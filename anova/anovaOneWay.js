import { seedSampleNormalDistribution, jitterXValues } from "../utils/data.js"
import { mean, roundDecimal, sum } from "../utils/math.js"
import { graphSample, graphSingleExample, graphSetUp } from "./utils.js"
import { addBracketSvg, addFractionSvg } from "../utils/graph.js"

export const groupIds = ["a", "b", "c"]
const groupNames = ["Black & White", "Brown", "Red"]
export const n = 20
const groupAData = jitterXValues(seedSampleNormalDistribution(5, 1, n))
const groupBData = jitterXValues(seedSampleNormalDistribution(6, 1, n))
const groupCData = jitterXValues(seedSampleNormalDistribution(4.2, 1, n))
const overallMean = mean([groupAData.map(d => d.y), groupBData.map(d => d.y), groupCData.map(d => d.y)].flat())
const groupData = [groupAData, groupBData, groupCData]
const groupMeans = groupData.map(data => mean(data.map(d => d.y)))
const [ groupAMean, groupBMean, groupCMean ] = groupMeans

const groupSsts = groupMeans.map(groupMean => ((groupMean - overallMean) ** 2) * n)
const sst = sum(groupSsts)
const groupSses = groupData.map((sample, idx) => sum(sample.map(point => (point.y - groupMeans[idx]) ** 2)))
const sse = sum(groupSses)
export const f = (sst / (groupIds.length - 1)) / ((sse / (n - 1) * groupIds.length))

const groupAGraph = d3.select("#group-a-graph")
const groupBGraph = d3.select("#group-b-graph")
const groupCGraph = d3.select("#group-c-graph")
const groupAGraphSST = d3.select("#group-a-graph-sst")
const groupBGraphSST = d3.select("#group-b-graph-sst")
const groupCGraphSST = d3.select("#group-c-graph-sst")

const width = 170
const height = 300
const tssWidth = 170
const margins = {
    top: 10,
    left: 30,
    right: 30,
    bottom: 50
}

const groupASvg = groupAGraph.append("svg")
    .attr("width", tssWidth)
    .attr("height", height)
const groupBSvg = groupBGraph.append("svg")
    .attr("width", tssWidth)
    .attr("height", height)
const groupCSvg = groupCGraph.append("svg")
    .attr("width", tssWidth + 120)
    .attr("height", height)
const groupASvgSST = groupAGraphSST.append("svg")
    .attr("width", width + 50)
    .attr("height", height)
const groupBSvgSST = groupBGraphSST.append("svg")
    .attr("width", width + 50)
    .attr("height", height)
const groupCSvgSST = groupCGraphSST.append("svg")
    .attr("width", width + 120)
    .attr("height", height)
const sstSseEqualsSvg = d3.select("#sst-sse-equals")
    .append("svg")
    .attr("width", 900)
    .attr("height", 300)

const groupSvgs = [groupASvg, groupBSvg, groupCSvg]
const sstGroupSvgs = [groupASvgSST, groupBSvgSST, groupCSvgSST]

const yRange = d3.range(0, 12, 0.01)
const sampleYDomain = d3.extent(yRange)
var sampleXGraphVals;
var sampleYGraphVals;
for (let i = 0; i < groupSvgs.length; i++) {
    let id = groupIds[i];
    [sampleXGraphVals, sampleYGraphVals] = graphSetUp(groupSvgs[i], sampleYDomain, `group-${id}-sample`, groupNames[i], height, width, margins)
    
    graphSetUp(sstGroupSvgs[i], sampleYDomain, `group-${id}-sample`, groupNames[i], height, width, margins)
    graphSample(groupSvgs[i], groupData[i], `group-${id}-sample`, overallMean, width, sampleXGraphVals, sampleYGraphVals)
    graphSample(sstGroupSvgs[i], groupData[i], `group-${id}-sample`, overallMean, width, sampleXGraphVals, sampleYGraphVals)
}

groupCSvg.append("text")
    .attr("class", "overall-mean-text")
    .text(`Overall x̄: ${roundDecimal(overallMean, 2)}`)
    .attr("x", width + 10)
    .attr("y", sampleYGraphVals(overallMean) + 6)
groupCSvgSST.append("text")
    .attr("class", "overall-mean-text")
    .text(`Overall x̄: ${roundDecimal(overallMean, 2)}`)
    .attr("x", width + 10)
    .attr("y", sampleYGraphVals(overallMean) + 6)
sstGroupSvgs.forEach((svg) => {
    svg.append("text")
        .attr("id", "sample-size-label")
        .text(`n = ${groupAData.length}`)
        .attr("x", width / 2)
        .attr("y", 15)
        .style("fill", "black")
})

const treatmentDiffSvg = d3.select("#single-example-treatment-diff")
    .append("svg")
    .attr("width", tssWidth)
    .attr("height", height)
const errorDiffSvg = d3.select("#single-example-error-diff")
    .append("svg")
    .attr("width", tssWidth)
    .attr("height", height)
const treatmentProportionSmallSvg = d3.select("#single-example-treatment-diff-small")
    .append("svg")
    .attr("width", tssWidth)
    .attr("height", height)
const treatmentProportionLargeSvg = d3.select("#single-example-treatment-diff-large")
    .append("svg")
    .attr("width", tssWidth)
    .attr("height", height)
const sstSseLargeSvg = d3.select("#sst-sse-large")
    .append("svg")
    .attr("width", tssWidth + 75)
    .attr("height", 300)
const sstSseSmallSvg = d3.select("#sst-sse-small")
    .append("svg")
    .attr("width", tssWidth + 75)
    .attr("height", 300)
const sstSseFracLargeSvg = d3.select("#sst-sse-frac-large")
    .append("svg")
    .attr("width", 350)
    .attr("height", 100)
const sstSseFracSmallSvg = d3.select("#sst-sse-frac-small")
    .append("svg")
    .attr("width", 350)
    .attr("height", 100)
const tssSingleExampleSvgs = [treatmentDiffSvg, errorDiffSvg, treatmentProportionSmallSvg, treatmentProportionLargeSvg]
const samplePoint1 = groupAData[0].y
const samplePoint2 = samplePoint1 + 0.4
const diffTreatment = overallMean - groupAMean
const diffError1 = groupAMean - samplePoint1
const diffError2 = groupAMean - samplePoint2

const [xGraphValuesTssExample, yGraphValuesTssExample] = graphSetUp(treatmentDiffSvg, [samplePoint1 - 0.3, samplePoint1 + 0.6], "tss-example", "", height, width, margins)
tssSingleExampleSvgs.slice(1, tssSingleExampleSvgs.length).forEach(svg => graphSetUp(svg, [samplePoint1 - 0.3, samplePoint1 + 0.6], "tss-example", "", height, width, margins))
tssSingleExampleSvgs.slice(0, tssSingleExampleSvgs.length - 1).forEach(svg => graphSingleExample(svg, groupAMean, overallMean, samplePoint1, yGraphValuesTssExample, width, margins))
graphSingleExample(treatmentProportionLargeSvg, groupAMean, overallMean, samplePoint2, yGraphValuesTssExample, width, margins)

tssSingleExampleSvgs.slice(0, tssSingleExampleSvgs.length - 1).forEach(svg => {
    svg.append("line")
        .attr("class", "dashed-line")
        .attr("x1", (width / 2))
        .attr("x2", (width / 2))
        .attr("y1", yGraphValuesTssExample(samplePoint1) - 8)
        .attr("y2", yGraphValuesTssExample(overallMean))
})
treatmentProportionLargeSvg.append("line")
    .attr("class", "dashed-line")
    .attr("x1", (width / 2))
    .attr("x2", (width / 2))
    .attr("y1", yGraphValuesTssExample(samplePoint2) - 8)
    .attr("y2", yGraphValuesTssExample(overallMean))

const sstExampleSvg = d3.select("#sst-subtract")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height)
const sseExampleSvg = d3.select("#sse-subtract")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height)

sstExampleSvg.append("text")
    .attr("id", "treatment-text")
    .text(`"Treatment" difference: ${roundDecimal(overallMean - groupAMean, 2)}`)
    .attr("x", 20)
    .attr("y", yGraphValuesTssExample(overallMean) + 20)
    .style("fill", "black")
sstExampleSvg.append("text")
    .attr("class", "bracket")
    .text("}")
    .attr("x", 0)
    .attr("y", yGraphValuesTssExample(overallMean) + 20)
    .style("fill", "black")
    .style("font-size", 30)
    .style("font-weight", 400)
sseExampleSvg.append("text")
    .text(`"Error" difference: ${roundDecimal(groupAMean - samplePoint1, 2)}`)
    .attr("x", 40)
    .attr("y", mean([yGraphValuesTssExample(groupAMean), yGraphValuesTssExample(samplePoint1)]) + 15)
    .style("fill", "black")
sseExampleSvg.append("text")
    .attr("class", "bracket")
    .text("}")
    .attr("x", 0)
    .attr("y", mean([yGraphValuesTssExample(groupAMean), yGraphValuesTssExample(samplePoint1)]) + 50)
    .style("fill", "black")
    .style("font-size", 150)

sstSseLargeSvg.append("text")
    .attr("id", "treatment-text")
    .text(`"Treatment" difference: ${roundDecimal(overallMean - groupAMean, 2)}`)
    .attr("x", 20)
    .attr("y", yGraphValuesTssExample(overallMean) + 12)
sstSseSmallSvg.append("text")
    .attr("id", "treatment-text")
    .text(`"Treatment" difference: ${roundDecimal(overallMean - groupAMean, 2)}`)
    .attr("x", 20)
    .attr("y", yGraphValuesTssExample(overallMean) + 12)
addBracketSvg(sstSseLargeSvg, yGraphValuesTssExample(overallMean), yGraphValuesTssExample(groupAMean) - 3)
addBracketSvg(sstSseSmallSvg, yGraphValuesTssExample(overallMean), yGraphValuesTssExample(groupAMean) - 3)
sstSseLargeSvg.append("text")
    .attr("id", "error-text")
    .text(`"Error" difference: ${roundDecimal(groupAMean - samplePoint1, 2)}`)
    .attr("x", 20)
    .attr("y", mean([yGraphValuesTssExample(groupAMean), yGraphValuesTssExample(samplePoint1)]) + 5)
sstSseSmallSvg.append("text")
    .attr("id", "error-text")
    .text(`"Error" difference: ${roundDecimal(groupAMean - samplePoint2, 2)}`)
    .attr("x", 20)
    .attr("y", mean([yGraphValuesTssExample(groupAMean), yGraphValuesTssExample(samplePoint2)]) + 5)
addBracketSvg(sstSseLargeSvg, yGraphValuesTssExample(samplePoint1), yGraphValuesTssExample(groupAMean) + 3)
addBracketSvg(sstSseSmallSvg, yGraphValuesTssExample(samplePoint2), yGraphValuesTssExample(groupAMean) + 3)

addFractionSvg(sstSseFracLargeSvg, "sst-sse-large", "Treatment", "Error", 55, 40, 20)
addFractionSvg(sstSseFracSmallSvg, "sst-sse-small", "Treatment", "Error", 55, 40, 20)
sstSseFracLargeSvg.append("text")
    .text("=")
    .style("fill", "black")
    .style("font-size", 30)
    .attr("x", 110)
    .attr("y", 50)
sstSseFracSmallSvg.append("text")
    .text("=")
    .style("fill", "black")
    .style("font-size", 30)
    .attr("x", 110)
    .attr("y", 50)
addFractionSvg(sstSseFracLargeSvg, "sst-sse-large", roundDecimal(diffTreatment, 2), roundDecimal(diffError1, 2), 170, 40, 30)
addFractionSvg(sstSseFracSmallSvg, "sst-sse-small", roundDecimal(diffTreatment, 2), roundDecimal(diffError2, 2), 170, 40, 30)
sstSseFracLargeSvg.append("text")
    .text(`= ${roundDecimal(diffTreatment / diffError1, 2)}`)
    .attr("id", "sst-sse-large-equals")
    .style("font-size", 30)
    .attr("x", 220)
    .attr("y", 50)
sstSseFracSmallSvg.append("text")
    .text(`= ${roundDecimal(diffTreatment / diffError2, 2)}`)
    .attr("id", "sst-sse-small-equals")
    .style("font-size", 30)
    .attr("x", 220)
    .attr("y", 50)

function transitionLine(svg, id, startingY, endingY) {
    svg.append("line").lower()
        .attr("id", `${id}-diff-line`)
        .attr("class", "diff-line")
        .attr("x1", (width / 2))
        .attr("x2", (width / 2))
        .attr("y1", yGraphValuesTssExample(startingY))
        .attr("y2", yGraphValuesTssExample(startingY))
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attr("y2", yGraphValuesTssExample(endingY))
}

export function transitionSSTExample(){
    transitionLine(treatmentDiffSvg, "treatment", groupAMean, overallMean)
}

export function resetSSTExample(){
    treatmentDiffSvg.selectAll(".diff-line").remove()
}

export function transitionDiffCompare() {
    transitionLine(treatmentProportionSmallSvg, "treatment", groupAMean, overallMean)
    transitionLine(treatmentProportionSmallSvg, "error", samplePoint1, groupAMean)
    transitionLine(treatmentProportionLargeSvg, "treatment", groupAMean, overallMean)
    transitionLine(treatmentProportionLargeSvg, "error", samplePoint2, groupAMean)
}

export function resetDiffCompare() {
    treatmentProportionSmallSvg.selectAll(".diff-line").remove()
    treatmentProportionLargeSvg.selectAll(".diff-line").remove()
}

export function transitionSSEExample(){
    transitionLine(errorDiffSvg, "error", samplePoint1, groupAMean)
}

export function resetSSEExample(){
    errorDiffSvg.selectAll(".diff-line").remove()
}

function unfocusSvg(svg) {
    svg.selectAll("circle")
        .transition()
        .style("fill-opacity", "20%")
    svg.select(".group-mean-line")
        .style("stroke-opacity", "20%")
    svg.selectAll("text")
        .style("opacity", "20%")
    }

function focusSvg(svg) {
    svg.select(".group-mean-line")
        .style("stroke-opacity", "100%")
    svg.selectAll("text")
        .style("opacity", "100%")
    }

const fCalcX = 720
const fCalcY = 100

function addSST(svg, groupMean, color, x, y, plusSign = false) {
    let chars = String(groupMean).length
    svg.select(".overall-mean-line").style("opacity", "100%")
    svg.append("text")
        .attr("class", "sst-addend")
        .text(`(${roundDecimal(overallMean, 2)}`)
        .style("fill", "red")
        .attr("x", x)
        .attr("y", y)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
    svg.append("text")
        .attr("class", "sst-addend")
        .text(` - ${roundDecimal(groupMean, 2)})²`)
        .style("fill", color)
        .attr("x", x + 53)
        .attr ("y", y)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
    svg.append("text")
        .attr("class", "sst-addend")
        .text(`× ${groupAData.length}`)
        .attr("x", (chars > 3) ? x + 125 : x + 110)
        .attr ("y", y)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
    if (plusSign) {
        svg.append("text")
            .text("+")
            .attr("class", "sst-addend")
            .attr("x", x - 20)
            .attr("y", y)
    }
}

function addSSE(svg, groupMean, color, x, y, plusSign = false) {
    let chars = String(groupMean).length
    svg.append("text")
        .attr("class", "sse-addend")
        .text("Σ(nⁱ")
        .style("font-size", 20)
        .style("text-align", "left")
        .attr("x", x)
        .attr("y", y)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
    svg.append("text")
        .attr("class", "sse-addend")
        .text(`- ${roundDecimal(groupMean, 2)})²`)
        .style("fill", color)
        .style("font-size", 20)
        .style("text-align", "left")
        .attr("x", x + 40)
        .attr ("y", y)
        .style("opacity", "0%")
        .transition()
        .style("opacity", "100%")
    if (plusSign) {
            svg.append("text")
                .text("+")
                .attr("class", "sse-addend")
                .attr("x", x - 20)
                .attr("y", y)
        }
}

function animateSSE(svg, samplePoints, overallMean, color) {
    svg.select(".overall-mean-line").style("opacity", "0%")
    for (let i = 0; i < samplePoints.length; i++) {
        setTimeout(function () {
            let point = samplePoints[i]
            svg.append('line')
                .lower()
                .attr("class", "sse-lines")
                .style("stroke", color)
                .attr("x1", sampleXGraphVals(point.x))
                .attr("x2", sampleXGraphVals(point.x))
                .attr("y1", sampleYGraphVals(point.y) + (point.y > overallMean ? 10 : -10))
                .attr("y2", sampleYGraphVals(point.y) + (point.y > overallMean ? 10 : -10))
                .transition()
                .ease(d3.easeLinear)
                .attr("y2", sampleYGraphVals(overallMean))
        }, i * 20)
    }
}

var timeout;

export function transitionSSTFull(){document.getElementById("intro-text").style.display = "block"
    d3.select("#sst-equals-text").remove()
    d3.select("#sse-equals-text").remove()
    document.getElementById("sse-description").style.display = "none";
    document.getElementById("sst-description").style.display = "block";
    let colors = ["steelblue", "#458a04", "#9c0c65"]
    sstGroupSvgs.forEach(svg => unfocusSvg(svg))
    for (let i = 0; i < sstGroupSvgs.length; i++) {
        timeout = setTimeout(function() {
            let currentSvg = sstGroupSvgs[i];
            let addPlusSign = (i > 0) ? true : false
            sstSseEqualsSvg.selectAll(".sse-addend").remove()
            focusSvg(currentSvg);
            addSST(sstSseEqualsSvg, roundDecimal(groupMeans[i], 2), colors[i], 120 + i * 210, fCalcY, addPlusSign)
            if (i == sstGroupSvgs.length - 1) {
                sstSseEqualsSvg.append("text")
                .attr("x", fCalcX)
                .attr("y", fCalcY)
                .attr("id", "sst-equals-text")
                .style("fill", "black")
                .text(`= SST = ${roundDecimal(sst, 2)}`)
            }
        }, i * 600)
    }
}

export function transitionSSEFull(){
    resetSSTFull()
    document.getElementById("intro-text").style.display = "none"
    d3.select("#sst-equals-text")
        .text(`SST = ${roundDecimal(sst, 2)}`)
        .attr("x", fCalcX)
        .attr("y", fCalcY)
        .transition()
        .delay(100)
        .ease(d3.easeLinear)
        .attr("y", fCalcY - 40)
    document.getElementById("sse-description").style.display = "block";
    let colors = ["steelblue", "#458a04", "#9c0c65"]
    for (let i = 0; i < sstGroupSvgs.length; i++) {
        let currentSvg = sstGroupSvgs[i];
        focusSvg(currentSvg);
        currentSvg.selectAll("circle").style("fill-opacity", "100%");
        sstSseEqualsSvg.selectAll(".sst-addend").remove()
        let addPlusSign = (i > 0) ? true : false;
        timeout = setTimeout(function() {
            animateSSE(currentSvg, groupData[i], groupMeans[i], colors[i], addPlusSign);
            addSSE(sstSseEqualsSvg, roundDecimal(groupMeans[i], 2), colors[i], 150 + i * 210, fCalcY, addPlusSign);
            if ( i == sstGroupSvgs.length - 1) {
                sstSseEqualsSvg.append("text")
                    .attr("id", "sse-equals-text")
                    .attr("x", fCalcX)
                    .attr("y", fCalcY)
                    .style("fill", "black")
                    .text(`= SSE = ${roundDecimal(sse, 2)}`)
                }
            }, i * 600);
    }
    sstSseEqualsSvg.selectAll(".sst-addend").remove()
}

export function transitionStop() {
    clearTimeout(timeout);
}

export function resetSSTFull() {
    document.getElementById("sst-description").style.display = "none";
    sstSseEqualsSvg.selectAll(".sst-addend").remove()
}

export function resetSSEFull() {
    d3.select("sse-equals-text").remove()
    document.getElementById("sse-description").style.display = "none";
    sstSseEqualsSvg.selectAll(".sst-addend").remove()
    sstGroupSvgs.forEach(svg => svg.selectAll(".sse-lines").remove())
}

var formulaX = 120
var subX = formulaX + 230
var simplifyX = subX + 250
var sstY = 100
var sseY = sstY + 90

export function transitionCalculateF() {
    sstSseEqualsSvg.selectAll("text").remove()
    document.getElementById("f-description").style.display = "block";
    addFractionSvg(sstSseEqualsSvg, "msst", "SST", "dfₖ", formulaX, sstY, 30)
    addFractionSvg(sstSseEqualsSvg, "msse", "SSE", "dfₙ", formulaX, sseY, 30)

    sstSseEqualsSvg.append("text").text("=").attr("class", "f-formula").attr("x", subX - 160).attr("y", mean([sstY, sseY]))
    addFractionSvg(sstSseEqualsSvg, "msst-sub", `${roundDecimal(sst, 2)}`, "# groups - 1", subX, sstY, 30)
    addFractionSvg(sstSseEqualsSvg, "msse-sub", `${roundDecimal(sse, 2)}`, "(n - 1) × # groups", subX, sseY, 30)

    setTimeout(function() {
        sstSseEqualsSvg.append("text").text("=").attr("class", "f-formula").attr("x", simplifyX - 90).attr("y", mean([sstY, sseY]))
        sstGroupSvgs.forEach(svg => svg.append("rect")
            .attr("class", "graph-outline")
            .attr("x", 10)
            .attr("y", 1)
            .attr("width", width)
            .attr("height", height - 1)
            .style("stroke", "steelblue")
            .style("fill", "none")
            .style("stroke-width", "1px")
            .transition()
            .duration(200)
            .delay(800)
            .style("stroke", "none")
        )
        addFractionSvg(sstSseEqualsSvg, "msst-simplify", `${roundDecimal(sst, 2)}`, `${groupIds.length} - 1`, simplifyX, sstY, 30)
        d3.select("#msst-sub-denominator")
            .transition()
            .style("fill", "steelblue")
        d3.select("#msst-simplify-denominator")
            .transition()
            .style("fill", "steelblue")
    }, 200)

    setTimeout(function() {
        sstGroupSvgs.forEach(svg => svg.append("rect")
                .attr("class", "graph-outline")
                .attr("x", width / 2 - 25)
                .attr("y", 1)
                .attr("width", 100)
                .attr("height", 20)
                .style("stroke", "steelblue")
                .style("fill", "none")
                .style("stroke-width", "1px")
                .transition()
                .duration(200)
                .delay(800)
                .style("stroke", "none")
        )
        sstSseEqualsSvg.append("text").text("=").attr("class", "f-formula").attr("x", simplifyX - 90).attr("y", mean([sstY, sseY]))
        addFractionSvg(sstSseEqualsSvg, "msse-simplify", `${roundDecimal(sse, 2)}`, `${(n - 1)} × ${groupIds.length}`, simplifyX, sseY, 30)
        d3.select("#msse-sub-denominator")
            .transition()
            .style("fill", "steelblue")
        d3.select("#msse-simplify-denominator")
            .transition()
            .style("fill", "steelblue")
    }, 1200)
}

export function resetCalculateF() {
    document.getElementById("f-description").style.display = "none";
}

export function displayF() {
    document.getElementById("f-display-description").style.display = "block";
    sstSseEqualsSvg.append("line")
        .attr("id", "final-frac-line")
        .attr("class", "frac-line")
        .attr("x1", simplifyX - 50)
        .attr("x2", simplifyX - 50)
        .attr("y1", mean([sstY, sseY]) - 5)
        .attr("y2", mean([sstY, sseY]) - 5)
        .transition()
        .delay(100)
        .ease(d3.easeLinear)
        .attr("x2", simplifyX + 50)
    sstSseEqualsSvg.append("text")
        .text(`= ${roundDecimal(f, 2)}`)
        .attr("id", "f-display")
        .attr("class", "f-formula")
        .attr("x", simplifyX + 90)
        .attr("y", mean([sstY, sseY]))
        .style("opacity", "0%")
        .transition()
        .delay(100)
        .style("opacity", "100%")
}

export function resetDisplayF() {
    document.getElementById("f-description").style.display = "none";
    d3.select("#final-frac-line").remove()
    d3.select("#f-display").remove()
}