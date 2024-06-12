import { drawDistribution, emptyGraph } from "../utils/graph.js";
import { generateNormalData, arraySampleDistribution } from "../utils/data.js";
import { roundDecimal, mean, sum, reverseLookupAreaUnderCurve, normalPdf, areaUnderCurve } from "../utils/math.js"

const width = 600
const height = 400
const margins = ({
    top: 40,
    right: 80,
    bottom: 50,
    left: 80
})

const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const xRange = d3.range(-0.5, 1, 0.1)
const yRange = d3.range(0, 8)

const alphaSelector = document.getElementById("alpha-scrubber")
const alphaValue = document.getElementById("alpha")
var alpha = parseFloat(alphaSelector.value);
alphaValue.innerHTML = alpha;

const effectSizeSelector = document.getElementById("effect-size-scrubber")
const effectSizeText = document.getElementById("effect-size")
var effectSize = parseFloat(effectSizeSelector.value);
effectSizeText.innerHTML = effectSize;

const sampleSizeSelector = document.getElementById("sample-size-scrubber")
const sampleSizeText = document.getElementById("sample-size")
var sampleSize = parseInt(sampleSizeSelector.value);
sampleSizeText.innerHTML = sampleSize;

alphaSelector.oninput = function() {
    alpha = parseFloat(this.value)
    alphaValue.innerHTML = alpha
    updateGraph(alpha)
    updatePowerCurve(alpha, effectSize, sampleSize)
}

effectSizeSelector.oninput = function() {
    effectSize = parseFloat(this.value)
    effectSizeText.innerHTML = effectSize
    updateDistributions()
    updateGraph(alpha)
    updatePowerCurve(alpha, effectSize, sampleSize)
}

sampleSizeSelector.oninput = function() {
    sampleSize = parseFloat(this.value)
    sampleSizeText.innerHTML = sampleSize
    updateDistributions()
    updateGraph(alpha)
    updatePowerCurve(alpha, effectSize, sampleSize)
}

const h0Mean = 0
var sd = 0.3
var se = sd / Math.sqrt(sampleSize)
var distribution1 = generateNormalData(d3.range(-0.5, 1, 0.001), 0, se)
var distribution2 = generateNormalData(d3.range(-0.5, 1, 0.001), effectSize, se)

function h0Pdf(x) {
    return normalPdf(x, h0Mean, se)
}

function h1Pdf(x) {
    return normalPdf(x, effectSize, se)
}

var [ graphXValues, graphYValues ] = emptyGraph(svg, xRange, yRange, width, height, margins)
var line = d3.line()
    .x(d => graphXValues(d.x))
    .y(d => graphYValues(d.y))

function updateDistributions (){
    svg.selectAll("path").remove()
    svg.selectAll(".pop-mean-text").remove()

    distribution1 = generateNormalData(d3.range(-0.5, 1, 0.001), 0, se)
    distribution2 = generateNormalData(d3.range(-0.5, 1, 0.001), effectSize, se)
    svg.append("path")
        .attr("class", "curve")
        .attr("id", "distribution-1")
        .data([distribution1])
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
    svg.append("text")
        .attr("class", "pop-mean-text")
        .attr("id", "h0-pop-mean-text")
        .text("h0: x̄ = 0")
        .attr("x", graphXValues(0))
        .attr("y", 50)
        .attr("y", graphYValues(distribution1.find(d => d.x == 0).y) - 20)

    svg.append("path")
        .attr("class", "curve")
        .attr("id", "distribution-2")
        .data([distribution2])
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    svg.append("text")
        .attr("class", "pop-mean-text")
        .attr("id", "h1-pop-mean-text")
        .text(`h1: x̄ = ${effectSize}`)
        .attr("x", (graphXValues(effectSize) < (graphXValues(h0Mean) + 100)) ? (graphXValues(h0Mean) + 100) : graphXValues(effectSize))
        .attr("y", graphYValues(h1Pdf(effectSize)) - 20)

}

function updateGraph(alpha) {
    svg.selectAll("#h0-alpha-line").remove()
    svg.selectAll("#power-area").remove()
    svg.selectAll("#power-text").remove()
    svg.selectAll("#alpha-text").remove()
    svg.selectAll("#power-rect").remove()

    var criticalValue = reverseLookupAreaUnderCurve(h0Pdf, -0.5, 1, 0.001, alpha)
    svg.append("line")
        .attr("id", "h0-alpha-line")
        .attr("x1", graphXValues(criticalValue))
        .attr("x2", graphXValues(criticalValue))
        .attr("y1", height - margins.bottom)
        .attr("y2", graphYValues(h0Pdf(criticalValue)))
    
    svg.append("text")
        .text(`α=${alpha}`)
        .attr("id", "alpha-text")
        .attr("x", graphXValues(criticalValue))
        .attr("y", height - margins.bottom + 40)

    let h1Area = d3.area()
        .x0((d) => {return graphXValues(d.x)})
        .y0(height - margins.bottom)
        .y1((d) => {return graphYValues(d.y)})
    let power = areaUnderCurve(h1Pdf, criticalValue, d3.extent(xRange)[1], 0.001)
    svg.append("path")
        .datum(distribution2.filter((d) => d.x >= criticalValue))
        .attr("id", "power-area")
        .attr("class", "area")
        .attr("d", h1Area)
        .lower()
    svg.append("text")
        .attr("id", "power-text")
        .text(`power = ${roundDecimal(power, 3)}`)
        .attr("x", width - 50)
        .attr("y", margins.top)
    svg.append("rect")
        .attr("id", "power-rect")
        .attr('width', 60 * power)
        .attr("height", 20)
        .attr("x", width - 50 - 130)
        .attr("y", margins.top - 15)
}


const powerCurveSvg = d3.select("#power-curve")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
var [ powerCurveXValues, powerCurveYValues ] = emptyGraph(powerCurveSvg, [0, 1], [0, 1], width, height, margins)

function powerCurveH0Pdf(x) {
    return normalPdf(x, 0, se)
}
var criticalValue = reverseLookupAreaUnderCurve(powerCurveH0Pdf, -0.5, 1.0, 0.001, alpha)
const altMeans = d3.range(0, 1, 0.001)
var altPowerValues = altMeans.map((altMean) => {
    function altPdf(x) {
        return normalPdf(x, altMean, se)
    }
    let power = areaUnderCurve(altPdf, criticalValue, altMean + (6 * se), 0.001)
    return {"x": altMean, "y": power}
})
var powerCurveLine = d3.line()
    .x(d => powerCurveXValues(d.x))
    .y(d => powerCurveYValues(d.y))

function updatePowerCurve(alpha, effectSize, sampleSize) {
    se = sd / Math.sqrt(sampleSize)
    function powerCurveH0Pdf(x) {
        return normalPdf(x, 0, se)
    }

    criticalValue = reverseLookupAreaUnderCurve(powerCurveH0Pdf, -0.5, 1.0, 0.001, alpha)
    altPowerValues = altMeans.map((altMean) => {
        function altPdf(x) {
            return normalPdf(x, altMean, se)
        }
        let power = areaUnderCurve(altPdf, criticalValue, altMean + (6 * se), 0.001)
        return {"x": altMean, "y": power}
    })
    let power = altPowerValues.find(d => d.x == effectSize).y

    powerCurveSvg.selectAll("line").remove()
    powerCurveSvg.selectAll("path").remove()
    powerCurveSvg.selectAll(".live-value").remove()
    powerCurveSvg.append("path")
        .attr("class", "curve")
        .attr("id", "power-curve-graph")
        .data([altPowerValues])
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", powerCurveLine);
    powerCurveSvg.append("line")
        .attr("id", "power-curve-effect-size")
        .attr("x1", powerCurveXValues(effectSize))
        .attr("x2", powerCurveXValues(effectSize))
        .attr("y1", height - margins.bottom)
        .attr("y2", 0)
    powerCurveSvg.append("line")
        .attr("id", "power-curve-power-value")
        .attr("x1", margins.left)
        .attr("x2", width)
        .attr("y1", powerCurveYValues(power))
        .attr("y2", powerCurveYValues(power))
    powerCurveSvg.append("text")
        .attr("class", "live-value")
        .text(roundDecimal(power, 2))
        .attr("x", 80)
        .attr("y", powerCurveYValues(power) - 10)
    powerCurveSvg.append("text")
        .attr("class", "live-value")
        .text(effectSize)
        .attr("x", powerCurveXValues(effectSize) + 10)
        .attr("y", height - margins.bottom)
}

powerCurveSvg.append("path")
    .attr("class", "curve")
    .attr("id", "power-curve-graph")
    .data([altPowerValues])
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", powerCurveLine);
powerCurveSvg.append("text")
    .text("Effect Size (Alternative Hypothesis)")
    .style("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height - margins.bottom + 40)
powerCurveSvg.append("text")
    .attr("id", "power-curve-y-label")
    .text("Power")
    .attr('transform', `rotate(-90)`)
    .attr("y", margins.left - 50)
    .attr("x", 0 - (height / 2))
    .style("text-anchor", "middle")

updateDistributions()
updateGraph(alpha)
updatePowerCurve(alpha, effectSize, sampleSize)