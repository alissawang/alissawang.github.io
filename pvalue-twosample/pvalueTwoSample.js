import { empty1DGraph, drawDistribution } from "../utils/graph.js"
import { generateNormalData, seedSampleNormalDistribution } from "../utils/data.js"
import { mean, standardDeviation, roundDecimal, normalPdf, areaUnderCurve } from "../utils/math.js"

var margin = ({
    top: 0,
    right: 30,
    bottom: 20,
    left: 80
})

var sampleWidth = 600
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

const varianceSvgWidth = 400
const varianceSvgHeight = 450
const sample1VarianceSvg = d3.select("#sample-1-variance").append("svg")
    .attr("width", varianceSvgWidth)
    .attr("height", varianceSvgHeight)
const sample1VarianceValues = empty1DGraph(
    sample1VarianceSvg, 
    d3.extent(sample1.concat(sample2)), 
    varianceSvgWidth,
    60,
    margin
)
sample1VarianceSvg.selectAll("#sample-values-1")
    .data(sample1)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("id", "sample-values-1")
    .attr("cx", d => sample1VarianceValues(d))
    .attr("cy", margin.top + 30)
sample1VarianceSvg.append("line")
    .attr("id", "sample-1-variance-mean-line")
    .attr("x1", sample1VarianceValues(mean1))
    .attr("x2", sample1VarianceValues(mean1))
    .attr("y1", 360)
    .attr("y2", 70)
sample1VarianceSvg.append("text")
    .text(`x̄ = ${roundDecimal(mean1, 2)}`)
    .attr("id", "sample-1-variance-mean-text")
    .attr("x", sample1VarianceValues(mean1))
    .attr("y", 10)
const sample1VarianceGraph = sample1.map((d, idx) => { return {"x": d, "y": 70 + (idx * 10)}})
sample1VarianceSvg.selectAll("#sample-1-var-diffs")
    .data(sample1VarianceGraph)
    .enter()
    .append("line")
    .attr("id", "sample-1-var-diffs")
    .attr("x1", d => sample1VarianceValues(d.x))
    .attr("x2", sample1VarianceValues(mean1))
    .attr("y1", d => d.y)
    .attr("y2", d => d.y)
sample1VarianceSvg.selectAll("#sample-1-var-points")
    .data(sample1VarianceGraph)
    .enter()
    .append("circle")
    .attr("id", "sample-1-var-points")
    .attr("r", 5)
    .attr("cx", d => sample1VarianceValues(d.x))
    .attr("cy", d => d.y)
sample1VarianceSvg.append("text")
    .text(`standard deviation = ${roundDecimal(sd1, 2)}`)
    .attr("id", "sample-1-sd-text")
    .attr("x", sample1VarianceValues(mean1))
    .attr("y", 410)
sample1VarianceSvg.append("line")
    .attr("id", "sample-1-sd-line")
    .attr("x1", sample1VarianceValues(mean1 - (sd1 / 2)))
    .attr("x2", sample1VarianceValues(mean1 + (sd1 / 2)))
    .attr("y1", 380)
    .attr("y2", 380)
sample1VarianceSvg.append("line")
    .attr("id", "sample-1-sd-line")
    .attr("x1", sample1VarianceValues(mean1 - (sd1 / 2)))
    .attr("x2", sample1VarianceValues(mean1 - (sd1 / 2)))
    .attr("y1", 380 - 5)
    .attr("y2", 380 + 5)
sample1VarianceSvg.append("line")
    .attr("id", "sample-1-sd-line")
    .attr("x1", sample1VarianceValues(mean1 + (sd1 / 2)))
    .attr("x2", sample1VarianceValues(mean1 + (sd1 / 2)))
    .attr("y1", 380 - 5)
    .attr("y2", 380 + 5)

const sample2VarianceSvg = d3.select("#sample-2-variance").append("svg")
    .attr("width", varianceSvgWidth)
    .attr("height", varianceSvgHeight)
const sample2VarianceValues = empty1DGraph(
    sample2VarianceSvg, 
    d3.extent(sample1.concat(sample2)), 
    varianceSvgWidth,
    60, 
    margin
)
sample2VarianceSvg.selectAll("#sample-values-2")
    .data(sample2)
    .enter()
    .append("circle")
    .attr("r", 8)
    .attr("id", "sample-values-2")
    .attr("cx", d => sample2VarianceValues(d))
    .attr("cy", margin.top + 30)
sample2VarianceSvg.append("line")
    .attr("id", "sample-2-variance-mean-line")
    .attr("x1", sample2VarianceValues(mean2))
    .attr("x2", sample2VarianceValues(mean2))
    .attr("y1", 360)
    .attr("y2", 70)
sample2VarianceSvg.append("text")
    .text(`x̄ = ${roundDecimal(mean2, 2)}`)
    .attr("id", "sample-2-variance-mean-text")
    .attr("x", sample2VarianceValues(mean2))
    .attr("y", 10)
const sample2VarianceGraph = sample2.map((d, idx) => { return {"x": d, "y": 70 + (idx * 10)}})
sample2VarianceSvg.selectAll("#sample-2-var-points")
    .data(sample2VarianceGraph)
    .enter()
    .append("circle")
    .attr("id", "sample-2-var-points")
    .attr("r", 5)
    .attr("cx", d => sample2VarianceValues(d.x))
    .attr("cy", d => d.y)
sample2VarianceSvg.selectAll("#sample-2-var-diffs")
    .data(sample2VarianceGraph)
    .enter()
    .append("line")
    .attr("id", "sample-2-var-diffs")
    .attr("x1", d => sample2VarianceValues(d.x))
    .attr("x2", sample2VarianceValues(mean2))
    .attr("y1", d => d.y)
    .attr("y2", d => d.y)
sample2VarianceSvg.append("text")
    .text(`standard deviation = ${roundDecimal(sd2, 2)}`)
    .attr("id", "sample-2-sd-text")
    .attr("x", sample2VarianceValues(mean2))
    .attr("y", 410)

sample2VarianceSvg.append("line")
    .attr("id", "sample-2-sd-line")
    .attr("x1", sample2VarianceValues(mean2 - (sd2 / 2)))
    .attr("x2", sample2VarianceValues(mean2 + (sd2 / 2)))
    .attr("y1", 380)
    .attr("y2", 380)
sample2VarianceSvg.append("line")
    .attr("id", "sample-2-sd-line")
    .attr("x1", sample2VarianceValues(mean2 - (sd2 / 2)))
    .attr("x2", sample2VarianceValues(mean2 - (sd2 / 2)))
    .attr("y1", 380 - 5)
    .attr("y2", 380 + 5)
sample2VarianceSvg.append("line")
    .attr("id", "sample-2-sd-line")
    .attr("x1", sample2VarianceValues(mean2 + (sd2 / 2)))
    .attr("x2", sample2VarianceValues(mean2 + (sd2 / 2)))
    .attr("y1", 380 - 5)
    .attr("y2", 380 + 5)

const meanDiff = Math.abs(mean1 - mean2)
const sd1Rounded = roundDecimal(sd1, 2)
const sd2Rounded = roundDecimal(sd2, 2)
const n1 = sample1.length
const n2 = sample2.length
const pooledVariance = (sd1Rounded ** 2 / n1) + (sd2Rounded ** 2 / n2)
const pooledVarianceRounded = roundDecimal(pooledVariance, 2)
document.getElementById("pooled-variance")
    .innerHTML = String.raw`\[\Large \color[RGB]{106, 196, 222}{${sd1Rounded}^2 \over ${n1}} + \color[RGB]{118, 204, 47}{${sd2Rounded}^2 \over ${n2}} \color{black} {= ${pooledVarianceRounded}}\]`

const pooledSd = Math.sqrt(pooledVariance)
document.getElementById("pooled-sd")
    .innerHTML = String.raw`\[\Large \sqrt{${pooledVarianceRounded}} = ${roundDecimal(pooledSd, 2)}\]`


const nullDistrWidth = 500
const nullDistrHeight = 400
const nullDistrMargins = {
    "top": 10,
    "left": 30,
    "right": 10,
    "bottom": 40
}
    
const nullDistrSvg = d3.select("#null-distribution").append("svg")
    .attr("width", nullDistrWidth)
    .attr("height", nullDistrHeight)
const nullDistrData = generateNormalData(d3.range(-3, 3, 0.01), 0, pooledSd)

function partialNormalPdf(input) {
    return normalPdf(input, 0, pooledSd)
}

const [ nullXGraphValues, nullYGraphValues ] = drawDistribution(nullDistrSvg, nullDistrData, nullDistrWidth, nullDistrHeight, nullDistrMargins)
nullDistrSvg.append("text")
    .text("μ = 0")
    .attr("x", nullDistrWidth / 2)
    .attr("y", nullDistrMargins.top + 5)
nullDistrSvg.append("text")
    .text(`sd = ${roundDecimal(pooledSd, 2)}`)
    .attr("x", nullDistrWidth / 2)
    .attr("y", nullDistrMargins.top + 30)
nullDistrSvg.append("text")
    .attr("id", "mean-diff-text-null-distr")
    .text(`|x̄2 - x̄1| = ${roundDecimal(meanDiff, 2)}`)
    .attr("x", nullXGraphValues(meanDiff) + 10)
    .attr("y", nullDistrHeight - nullDistrMargins.bottom + 40)
nullDistrSvg.append("line")
    .attr("id", "mean-diff-tick-null-distr")
    .attr("x1", nullXGraphValues(meanDiff))
    .attr("x2", nullXGraphValues(meanDiff))
    .attr("y1", nullDistrHeight - nullDistrMargins.bottom + 10)
    .attr("y2", nullYGraphValues(partialNormalPdf(meanDiff)))
    .lower()
let pValue = areaUnderCurve(partialNormalPdf, meanDiff, 3, 0.001)
nullDistrSvg.append("text")
    .attr("id", "pValue")
    .text(`p = ${roundDecimal(pValue, 3)}`)
    .attr("x", nullDistrWidth * (3/4))
    .attr("y", nullDistrHeight * (3/4))
var nullDistrArea = d3.area()
    .x0((d) => {return nullXGraphValues(d.x)})
    .y0(nullDistrHeight - nullDistrMargins.bottom)
    .y1((d) => {return nullYGraphValues(d.y)})
nullDistrSvg.append("path")
    .datum(nullDistrData.filter((d) => d.x >= meanDiff))
    .attr("id", "p-value-area")
    .attr("class", "area")
    .attr("d", nullDistrArea)
    .lower()
d3.select("#conclusion").append("text")
    .text(`The probability of observing a difference of ${roundDecimal(meanDiff, 3)} or more is ${roundDecimal(pValue, 3)}.`)