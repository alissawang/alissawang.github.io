import { seedSampleNormalDistribution } from "../utils/data.js"
import { mean, roundDecimal, sum } from "../utils/math.js"

const groupIds = ["a", "b", "c"]
const sampleData = jitterXValues(seedSampleNormalDistribution(5, 2.5, 60))
const groupAData = sampleData.slice(0, 20)
const groupBData = sampleData.slice(20, 40)
const groupCData = sampleData.slice(40, 60)
const groupAMean = mean(groupAData.map(d => d.y))
const groupBMean = mean(groupBData.map(d => d.y))
const groupCMean = mean(groupCData.map(d => d.y))
const overallMean = mean(sampleData.map(d => d.y))
const groupData = [groupAData, groupBData, groupCData]
const groupMeans = [groupAMean, groupBMean, groupCMean]

const sstGroupA = ((groupAMean - overallMean) ** 2) * groupAData.length
const sstGroupB = ((groupBMean - overallMean) ** 2) * groupBData.length
const sstGroupC = ((groupCMean - overallMean) ** 2) * groupCData.length
const sseGroupA = sum(groupAData.map(point => (point.y - groupAMean) ** 2))
const sseGroupB = sum(groupBData.map(point => (point.y - groupBMean) ** 2))
const sseGroupC = sum(groupCData.map(point => (point.y - groupCMean) ** 2))
const groupSSEs = [sseGroupA, sseGroupB, sseGroupC]

const groupAGraph = d3.select("#group-a-graph")
const groupBGraph = d3.select("#group-b-graph")
const groupCGraph = d3.select("#group-c-graph")
const groupAGraphSST = d3.select("#group-a-graph-sst")
const groupBGraphSST = d3.select("#group-b-graph-sst")
const groupCGraphSST = d3.select("#group-c-graph-sst")

const width = 150
const height = 300
const margins = {
    top: 10,
    left: 30,
    right: 30,
    bottom: 40
}

const groupASvg = groupAGraph.append("svg")
    .attr("width", width)
    .attr("height", height)
const groupBSvg = groupBGraph.append("svg")
    .attr("width", width)
    .attr("height", height)
const groupCSvg = groupCGraph.append("svg")
    .attr("width", width + 120)
    .attr("height", height)
const groupASvgSST = groupAGraphSST.append("svg")
    .attr("width", width + 50)
    .attr("height", height + 200)
const groupBSvgSST = groupBGraphSST.append("svg")
    .attr("width", width + 50)
    .attr("height", height + 200)
const groupCSvgSST = groupCGraphSST.append("svg")
    .attr("width", width + 120)
    .attr("height", height + 200)

const groupSvgs = [groupASvg, groupBSvg, groupCSvg]
const sstGroupSvgs = [groupASvgSST, groupBSvgSST, groupCSvgSST]

const yRange = d3.range(0, 12, 0.01)
const sampleYDomain = d3.extent(yRange)
var sampleXGraphVals;
var sampleYGraphVals;
for (let i = 0; i < groupSvgs.length; i++) {
    let id = groupIds[i];
    [sampleXGraphVals, sampleYGraphVals] = graphSetUp(groupSvgs[i], sampleYDomain, `group-${id}-sample`, `Group ${id.toUpperCase()}`, height, width, margins)
    
    graphSetUp(sstGroupSvgs[i], sampleYDomain, `group-${id}-sample`, `Group ${id.toUpperCase()}`, height, width, margins)
    graphSample(groupSvgs[i], groupData[i], `group-${id}-sample`, width, sampleXGraphVals, sampleYGraphVals)
    graphSample(sstGroupSvgs[i], groupData[i], `group-${id}-sample`, width, sampleXGraphVals, sampleYGraphVals)
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
        .text(`n = ${groupAData.length}`)
        .attr("x", width / 2)
        .attr("y", 15)
        .style("fill", "black")
})

const tssSingleExampleSvg = d3.select("#tss-single-example")
    .append("svg")
    .attr("width", width + 400)
    .attr("height", height)
const tssSingleExampleSvg2 = d3.select("#tss-single-example-2")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height)
const tssSingleExampleSvg3 = d3.select("#tss-single-example-3")
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height)
const tssSingleExampleSvg4 = d3.select("#tss-single-example-4")
    .append("svg")
    .attr("width", width + 150)
    .attr("height", height)
const tssSingleExampleSvg5 = d3.select("#tss-single-example-5")
    .append("svg")
    .attr("width", width + 150)
    .attr("height", height)
const sstSseLargeSvg = d3.select("#sst-sse-large")
    .append("svg")
    .attr("width", 220)
    .attr("height", 300)
const sstSseSmallSvg = d3.select("#sst-sse-small")
    .append("svg")
    .attr("width", 220)
    .attr("height", 300)
const sstSseFracLargeSvg = d3.select("#sst-sse-frac-large")
    .append("svg")
    .attr("width", 350)
    .attr("height", 100)
const sstSseFracSmallSvg = d3.select("#sst-sse-frac-small")
    .append("svg")
    .attr("width", 350)
    .attr("height", 100)
const tssSingleExampleSvgs = [tssSingleExampleSvg2, tssSingleExampleSvg3, tssSingleExampleSvg4]
const samplePoint1 = groupAData[8].y
const samplePoint2 = groupAData[7].y
const diffTreatment = overallMean - groupAMean
const diffError1 = groupAMean - samplePoint1
const diffError2 = groupAMean - samplePoint2

const [xGraphValuesTssExample, yGraphValuesTssExample] = graphSetUp(tssSingleExampleSvg, [samplePoint1 - 0.5, samplePoint1 + 2.5], "tss-example", "", height, width, margins)
tssSingleExampleSvgs.forEach(svg => graphSetUp(svg, [samplePoint1 - 0.5, samplePoint1 + 2.5], "tss-example", "", height, width, margins))
tssSingleExampleSvgs.forEach(svg => graphSingleExample(svg, samplePoint1))

graphSetUp(tssSingleExampleSvg5, [samplePoint1 - 0.5, samplePoint1 + 2.5], "tss-example", "", height, width, margins)
graphSingleExample(tssSingleExampleSvg, samplePoint1)
graphSingleExample(tssSingleExampleSvg5, samplePoint2)

tssSingleExampleSvg.append("line")
    .attr("class", "dashed-line")
    .attr("x1", (width / 2))
    .attr("x2", (width / 2))
    .attr("y1", yGraphValuesTssExample(samplePoint1) - 8)
    .attr("y2", yGraphValuesTssExample(samplePoint1) - 8)
    .transition()
    .ease(d3.easeLinear)
    .duration(500)
    .attr("y2", yGraphValuesTssExample(overallMean))
tssSingleExampleSvg.append("text")
    .text("}")
    .attr("class", "bracket")
    .style("font-size", 200)
    .style("font-weight", 100)
    .attr("x", width + 150)
    .attr("y", height / 2 + 40)
tssSingleExampleSvg.append("text")
    .text(`Total difference:`)
    .style("font-size", 15)
    .style("font-weight", 100)
    .attr("x", width + 220)
    .attr("y", height / 2 - 10)
tssSingleExampleSvg.append("text")
    .text(roundDecimal((overallMean - samplePoint1), 2))
    .style("font-size", 20)
    .style("font-weight", 100)
    .attr("dy", "1em")
    .attr("x", width + 220)
    .attr("y", height / 2 - 10)

tssSingleExampleSvgs.forEach(svg => {
    svg.append("line")
        .attr("class", "dashed-line")
        .attr("x1", (width / 2))
        .attr("x2", (width / 2))
        .attr("y1", yGraphValuesTssExample(samplePoint1) - 8)
        .attr("y2", yGraphValuesTssExample(overallMean))
})
tssSingleExampleSvg5.append("line")
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
    .text(`"Treatment" difference: ${roundDecimal(overallMean - groupAMean, 2)}`)
    .attr("x", 20)
    .attr("y", yGraphValuesTssExample(overallMean) + 12)
    .style("fill", "black")
sstSseSmallSvg.append("text")
    .text(`"Treatment" difference: ${roundDecimal(overallMean - groupAMean, 2)}`)
    .attr("x", 20)
    .attr("y", yGraphValuesTssExample(overallMean) + 12)
    .style("fill", "black")
addBracketSvg(sstSseLargeSvg, yGraphValuesTssExample(overallMean), yGraphValuesTssExample(groupAMean) - 3)
addBracketSvg(sstSseSmallSvg, yGraphValuesTssExample(overallMean), yGraphValuesTssExample(groupAMean) - 3)
sstSseLargeSvg.append("text")
    .text(`"Error" difference: ${roundDecimal(groupAMean - samplePoint1, 2)}`)
    .attr("x", 20)
    .attr("y", mean([yGraphValuesTssExample(groupAMean), yGraphValuesTssExample(samplePoint1)]) + 5)
    .style("fill", "black")
sstSseSmallSvg.append("text")
    .text(`"Error" difference: ${roundDecimal(groupAMean - samplePoint2, 2)}`)
    .attr("x", 20)
    .attr("y", mean([yGraphValuesTssExample(groupAMean), yGraphValuesTssExample(samplePoint2)]) + 5)
    .style("fill", "black")
addBracketSvg(sstSseLargeSvg, yGraphValuesTssExample(samplePoint1), yGraphValuesTssExample(groupAMean) + 3)
addBracketSvg(sstSseSmallSvg, yGraphValuesTssExample(samplePoint2), yGraphValuesTssExample(groupAMean) + 3)

addFractionSvg(sstSseFracLargeSvg, "sst-sse-large", "Treatment", "Error", 50, 40, 20)
addFractionSvg(sstSseFracSmallSvg, "sst-sse-small", "Treatment", "Error", 50, 40, 20)
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
    .style("fill", "black")
    .style("font-size", 30)
    .attr("x", 220)
    .attr("y", 50)
sstSseFracSmallSvg.append("text")
    .text(`= ${roundDecimal(diffTreatment / diffError2, 2)}`)
    .style("fill", "black")
    .style("font-size", 30)
    .attr("x", 220)
    .attr("y", 50)

function jitterXValues(data) {
    return data.map(point => {return {"x": 0.5 + Math.random() * 0.3, "y": point.x}})
}

function addFractionSvg(svg, id, numerator, denominator, x, y, fontSize) {
    let maxChars = d3.max([String(numerator).length, String(denominator).length])
    svg.append("text")
        .attr("id", `${id}-numerator`)
        .style("font-size", fontSize)
        .style("text-anchor", "middle")
        .text(numerator)
        .attr("x", x)
        .attr("y", y - 10)
    svg.append("line")
        .attr("id", `${id}-frac-line`)
        .attr("x1", x - (fontSize * (maxChars * 0.25)))
        .attr("x2", x + (fontSize * (maxChars * 0.25)))
        .attr("y1", y)
        .attr("y2", y)
    svg.append("text")
        .attr("id", `${id}-denominator`)
        .style("font-size", fontSize)
        .style("text-anchor", "middle")
        .text(denominator)
        .attr("dy", "1em")
        .attr("x", x)
        .attr("y", y + 5)
}

function addBracketSvg(svg, startingY, endingY) {
    let bracketWidth = 8
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", bracketWidth)
        .attr("x2", bracketWidth)
        .attr("y1", startingY)
        .attr("y2", endingY)
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", 0)
        .attr("x2", bracketWidth)
        .attr("y1", startingY)
        .attr("y2", startingY)
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", 0)
        .attr("x2", bracketWidth)
        .attr("y1", endingY)
        .attr("y2", endingY)
}

function transitionLine(svg, startingY, endingY) {
    svg.append("line").lower()
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

function graphSingleExample(svg, samplePoint) {
    svg.append("line")
        .attr("id", "tss-example-mean-line")
        .attr("x1", (width / 2) - 10)
        .attr("x2", (width / 2) + 10)
        .attr("y1", yGraphValuesTssExample(groupAMean))
        .attr("y2", yGraphValuesTssExample(groupAMean))
    svg.append("line")
        .attr("class", "overall-mean-line")
        .attr("x1", margins.left)
        .attr("x2", width - 30)
        .attr("y1", yGraphValuesTssExample(overallMean))
        .attr("y2", yGraphValuesTssExample(overallMean))
    svg.append("circle")
        .attr("id", "tss-example-point")
        .attr("r", 8)
        .attr("cx", width / 2)
        .attr("cy", yGraphValuesTssExample(samplePoint))
    svg.append("text")
        .attr("class", "sample-point-text")
        .text(roundDecimal(samplePoint, 2))
        .attr("x", (width / 2) + 20)
        .attr("y", yGraphValuesTssExample(samplePoint) + 5)
    svg.append("text")
        .attr("class", "group-a-sample-mean-text")
        .text(roundDecimal(groupAMean, 2))
        .attr("x", (width / 2) + 20)
        .attr("y", yGraphValuesTssExample(groupAMean) + 5)
    svg.append("text")
        .attr("class", "overall-mean-text")
        .text(roundDecimal(overallMean, 2))
        .attr("x", (width / 2) + 50)
        .attr("y", yGraphValuesTssExample(overallMean) + 5)
    svg.append("text")
        .attr("class", "overall-mean-text")
        .text("Overall mean")
        .style("text-anchor", "right")
        .attr("x", width + 50)
        .attr("y", yGraphValuesTssExample(overallMean) + 5)
    svg.append("text")
        .attr("class", "group-a-sample-mean-text")
        .text("Group mean")
        .style("text-anchor", "right")
        .attr("x", width + 50)
        .attr("y", yGraphValuesTssExample(groupAMean) + 5)
    svg.append("text")
        .attr("class", "sample-point-text")
        .text("Sample point")
        .style("text-anchor", "right")
        .attr("x", width + 50)
        .attr("y", yGraphValuesTssExample(samplePoint) + 5)
}

function graphSetUp(svg, yDomain, id, xlabel, height, width, margins) {
    let xDomain = [0, 1]
    let xGraphRange = [margins.left, width - margins.right]
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range(xGraphRange)
    let axisBottom = d3.axisBottom(xGraphValues).tickValues([])
        
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margins.bottom})`)
        .call(axisBottom)
        .select(".domain").remove();
    svg.append("g").call(xAxis);

    let yGraphRange = [height - margins.bottom, margins.top]
    let yGraphValues = d3.scaleLinear()
        .domain(yDomain)
        .range(yGraphRange)
    let axisLeft = d3.axisLeft(yGraphValues).tickValues(d3.scaleLinear().domain(yGraphValues.domain()).ticks())
    const yAxis = g => g
        .attr("transform", `translate(${margins.left},0)`)
        .call(axisLeft)
    svg.append("g").call(yAxis);
    svg.append("text")
        .attr("id", `${id}-xlabel`)
        .text(xlabel)
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 10)
    return [xGraphValues, yGraphValues]
}

function graphSample(svg, data, id, width, xGraphValues, yGraphValues) {
    let mean_ = mean(data.map(d => d.y))
    svg.append("line")
        .attr("class", "overall-mean-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yGraphValues(overallMean))
        .attr("y2", yGraphValues(overallMean))
    svg.selectAll(`#${id}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("id", id)
        .attr("r", 8)
        .attr("cx", d => xGraphValues(d.x))
        .attr("cy", d => yGraphValues(d.y))
    svg.append("line")
        .attr("id", `${id}-mean`)
        .attr("x1",80)
        .attr("x2", 100 + 10)
        .attr("y1", yGraphValues(mean_))
        .attr("y2", yGraphValues(mean_))
    svg.append("text")
        .attr("class", `${id}-mean-text`)
        .text(`x̄: ${roundDecimal(mean_, 2)}`)
        .attr("x", 110)
        .attr("y", yGraphValues(mean_) + 5)
    return yGraphValues
}

export function transitionSSTExample(){
    transitionLine(tssSingleExampleSvg2, groupAMean, overallMean)
}

export function resetSSTExample(){
    tssSingleExampleSvg2.selectAll(".diff-line").remove()
}

export function transitionSSEExample(){
    transitionLine(tssSingleExampleSvg3, samplePoint1 + 0.08, groupAMean)
}

export function resetSSEExample(){
    tssSingleExampleSvg3.selectAll(".diff-line").remove()
}

function whiteoutSvg(svg) {
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white")
        .style("fill-opacity", "80%")
        .transition()
    }

function addSST(svg, groupMean, color) {
    let chars = String(groupMean).length
    let x = 15
    svg.append("text").transition()
        .attr("class", "tss-frac")
        .text(`(${roundDecimal(overallMean, 2)}`)
        .style("fill", "red")
        .style("font-size", 20)
        .style("text-align", "left")
        .attr("x", x)
        .attr ("y", height + 100)
    svg.append("text").transition()
        .attr("class", "tss-frac")
        .text(` - ${roundDecimal(groupMean, 2)})²`)
        .style("fill", color)
        .style("font-size", 20)
        .style("text-align", "left")
        .attr("x", x + 53)
        .attr ("y", height + 100)
    svg.append("text").transition()
        .attr("class", "tss-frac")
        .text(`× ${groupAData.length}`)
        .style("fill", "black")
        .style("font-size", 20)
        .style("text-align", "left")
        .attr("x", (chars > 3) ? x + 125 : x + 110)
        .attr ("y", height + 100)
}

function addSSE(svg, samplePoints, overallMean, color) {
    let x = 15;
    svg.selectAll(".sse-lines")
        .data(samplePoints)
        .enter()
        .append("line")
        .attr("class", "sse-lines")
        .attr("id", "")
        .style("stroke", color)
        .attr("x1", point => sampleXGraphVals(point.x))
        .attr("x2", point => sampleXGraphVals(point.x))
        .attr("y1", point => sampleYGraphVals(point.y))
        .attr("y2", sampleYGraphVals(overallMean))
}
addSSE(groupASvgSST, groupAData, groupAMean, "#c1e9f7")

export function transitionSSTFull(){
    let colors = ["steelblue", "#458a04", "#9c0c65"]
    whiteoutSvg(groupBSvgSST)
    whiteoutSvg(groupCSvgSST)
    for (let i = 0; i < sstGroupSvgs.length; i++) {
        setTimeout(function() {
            if (i > 0) {
                whiteoutSvg(sstGroupSvgs[i-1])
            }
            let currentSvg = sstGroupSvgs[i];
            currentSvg.selectAll("rect").remove();
            currentSvg.selectAll("circle")
                .transition()
                .style("fill-opacity", "20%")
            addSST(currentSvg, roundDecimal(groupMeans[i], 2), colors[i])
        }, i * 1000)
    }
}

export function resetSSTFull() {
    sstGroupSvgs.forEach(svg => svg.select("rect").remove())
    sstGroupSvgs.forEach(svg => svg.selectAll(".tss-frac").remove())
}

export function transitionSSEFull(){
    let colors = ["steelblue", "#458a04", "#9c0c65"]
    whiteoutSvg(groupBSvgSST)
    whiteoutSvg(groupCSvgSST)
    for (let i = 0; i < sstGroupSvgs.length; i++) {
        setTimeout(function() {
            if (i > 0) {
                whiteoutSvg(sstGroupSvgs[i-1])
            }
            let currentSvg = sstGroupSvgs[i];
            currentSvg.selectAll("rect").remove();
            currentSvg.selectAll("circle")
                .transition()
                .style("fill-opacity", "20%")
            addSST(currentSvg, roundDecimal(groupMeans[i], 2), colors[i])
        }, i * 1000)
    }
}