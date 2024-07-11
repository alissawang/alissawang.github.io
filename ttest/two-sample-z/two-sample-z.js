import { seedSampleNormalDistribution } from "../../utils/data.js"
import { mean, standardDeviation, roundDecimal } from "../../utils/math.js"
import { empty1DGraph } from "../../utils/graph.js"

var margin = ({
    top: 0,
    right: 30,
    bottom: 20,
    left: 80
})

var sampleWidth = 700
var sampleHeight = 200

var popMean1 = 35.1
const popMean2 = 35.9
var sample1 = seedSampleNormalDistribution(popMean1, 1.8, 30).map(d => d.x).sort()
var sample2 = seedSampleNormalDistribution(35.9, 1.2, 30).map(d => d.x).sort()
var mean1 = mean(sample1)
const mean2 = mean(sample2)
const sd1 = standardDeviation(sample1)
const sd2 = standardDeviation(sample2)

const sampleSvg = d3.select("#samples").append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)

const sampleXGraphValues = empty1DGraph(sampleSvg, d3.range(30, 41, 1), sampleWidth, sampleHeight, margin)
const sampleOffset = 100
const sample1Height = margin.top + 40

sampleSvg.selectAll("#sample-values-1")
    .data(sample1)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("id", "sample-values-1")
    .attr("cx", d => sampleXGraphValues(d))
    .attr("cy", sample1Height)
sampleSvg.append("line")
    .attr("id", "mean-1")
    .attr("x1", sampleXGraphValues(mean1))
    .attr("x2", sampleXGraphValues(mean1))
    .attr("y1", sample1Height + 8)
    .attr("y2", sample1Height + 50)
sampleSvg.append("text")
    .attr("id", "mean-1-text")
    .text(`x̄ = ${roundDecimal(mean1, 2)}`)
    .attr("x", sampleXGraphValues(mean1))
    .attr("y", sample1Height - 25)
sampleSvg.append("text")
    .text("Group 1")
    .attr("class", "x-axis-label")
    .attr("id", "group-1-label")
    .attr("x", 0)
    .attr("y", sample1Height)

sampleSvg.selectAll("#sample-values-2")
    .data(sample2)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("id", "sample-values-2")
    .attr("cx", d => sampleXGraphValues(d))
    .attr("cy", sample1Height + sampleOffset)
sampleSvg.append("line")
    .attr("id", "mean-2")
    .attr("x1", sampleXGraphValues(mean2))
    .attr("x2", sampleXGraphValues(mean2))
    .attr("y1", sample1Height + sampleOffset - 70)
    .attr("y2", sample1Height + sampleOffset + 8)
sampleSvg.append("text")
    .attr("id", "mean-2-text")
    .text(`x̄ = ${roundDecimal(mean2, 2)}`)
    .attr("x", sampleXGraphValues(mean2))
    .attr("y", sample1Height + sampleOffset + 25)
sampleSvg.append("text")
    .text("Group 2")
    .attr("class", "x-axis-label")
    .attr("x", 0)
    .attr("y", sample1Height + sampleOffset)

const differenceInMeans = Math.abs(mean1 - mean2)
const diffInMeansSvg = d3.select("#diff-in-means").append("svg")
    .attr("width", sampleWidth)
    .attr("height", sampleHeight)
const diffInMeansGraphValues = empty1DGraph(diffInMeansSvg, d3.range(30, 41, 1), sampleWidth, 100, margin, true)
sampleSvg.append("line")
    .attr("id", "dim")
    .attr("x1", diffInMeansGraphValues(mean1))
    .attr("x2", diffInMeansGraphValues(mean2))
    .attr("y1", (sampleHeight / 2) - 10)
    .attr("y2", (sampleHeight / 2) - 10)
sampleSvg.append("line")
    .attr("id", "dim-mean-1")
    .attr("x1", diffInMeansGraphValues(mean1))
    .attr("x2", diffInMeansGraphValues(mean1))
    .attr("y1", (sampleHeight / 2) - 20)
    .attr("y2", (sampleHeight / 2) - 3)
sampleSvg.append("line")
    .attr("id", "dim-mean-2")
    .attr("x1", diffInMeansGraphValues(mean2))
    .attr("x2", diffInMeansGraphValues(mean2))
    .attr("y1", (sampleHeight / 2) - 20)
    .attr("y2", (sampleHeight / 2 - 3))
sampleSvg.append("text")
    .attr("id", "dim-text")
    .text(roundDecimal(differenceInMeans, 2))
    .attr("x", diffInMeansGraphValues(mean1) + 20)
    .attr("y", (sampleHeight / 2) - 20)