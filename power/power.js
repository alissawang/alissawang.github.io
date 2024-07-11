import { drawNormalDistribution, emptyGraph, graphAreaUnderCurve } from "../utils/graph.js";
import { generateNormalData, arraySampleDistribution } from "../utils/data.js";
import { roundDecimal, mean, sum, reverseLookupAreaUnderCurve, normalPdf, areaUnderCurve } from "../utils/math.js"

function initializeScrubber(scrubberId, valueId) {
    let selectorElement = document.getElementById(scrubberId);
    let valueElement = document.getElementById(valueId);
    let value = parseFloat(selectorElement.value);
    valueElement.innerHTML = value;
    return [ selectorElement, valueElement, value ]
}

var [ alphaSelector, alphaValue, alpha ] = initializeScrubber("alpha-scrubber", "alpha")
var [ effectSizeSelector, effectSizeText, effectSize ] = initializeScrubber("effect-size-scrubber", "effect-size")
var [ sampleSizeSelector, sampleSizeText, sampleSize ] = initializeScrubber("sample-size-scrubber", "sample-size")
const h0Mean = 0;
const sd = 0.3;
const xRange = d3.range(-0.3, 0.7, 0.001)
var se = sd / Math.sqrt(sampleSize);
var distribution1 = generateNormalData(xRange, 0, se);
var distribution2 = generateNormalData(xRange, effectSize, se);

alphaSelector.oninput = function() {
    alpha = parseFloat(this.value)
    alphaValue.innerHTML = alpha
    updateSignificance(powerSvg, alpha)
    updatePowerCurve(alpha, effectSize, sampleSize)
}

effectSizeSelector.oninput = function() {
    effectSize = parseFloat(this.value)
    effectSizeText.innerHTML = effectSize
    updateDistributions(powerSvg, effectSize, sampleSize)
    updateSignificance(powerSvg, alpha)
    updatePowerCurve(alpha, effectSize, sampleSize)
}

sampleSizeSelector.oninput = function() {
    sampleSize = parseFloat(this.value)
    sampleSizeText.innerHTML = sampleSize
    updateDistributions(powerSvg, effectSize, sampleSize)
    updateSignificance(powerSvg, alpha)
    updatePowerCurve(alpha, effectSize, sampleSize)
}

const width = 800
const powerCurveWidth = 0.7 * width
const height = 500
const powerCurveHeight = 0.4 * height
const margins = ({
    top: 40,
    right: 80,
    bottom: 50,
    left: 80
})

const nullDistrSvg = d3.select("#null-distribution")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const compareDistrSvg = d3.select("#compare-distributions")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const powerSvg = d3.select("#distributions")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const powerCurveSvg = d3.select("#power-curve")
    .append("svg")
    .attr("width", 0.7 * width)
    .attr("height", 0.4 * height)
const yRange = d3.range(0, 9)

const [ nullXValues, nullYValues ] = drawNormalDistribution(nullDistrSvg, xRange, 0, se, width, height, margins, {"yExtent": d3.extent(yRange), "id": "null-graph-distr"});
const [ powerXValues, powerYValues ] = emptyGraph(compareDistrSvg, xRange, yRange, width, height, margins);
emptyGraph(powerSvg, xRange, yRange, width, height, margins);
var [ powerCurveXValues, powerCurveYValues ] = emptyGraph(powerCurveSvg, xRange, [0, 1], powerCurveWidth, powerCurveHeight, {"top": 20, "bottom": 50, "left": 80, "right": 0})

function nullDistr(x) {
    return normalPdf(x, 0, se)
}
var criticalValue = graphAreaUnderCurve(nullDistrSvg, nullDistr, xRange, 0.05, nullXValues, nullYValues, height, margins, "null-critical-value", "")
graphAreaUnderCurve(compareDistrSvg, nullDistr, xRange, 0.05, nullXValues, nullYValues, height, margins, "null-critical-value", "")
nullDistrSvg.append("text")
    .attr("class", "pop-mean-text")
    .attr("id", "h0-pop-mean-text")
    .text("h0: x̄ = 0")
    .attr("x", nullXValues(0) - 30)
    .attr("y", nullYValues(nullDistr(0)) - 20)
nullDistrSvg.append("text")
    .attr("id", "null-distr-p-value")
    .text("p = 0.05")
    .attr("x", nullXValues(0.3))
    .attr("y", nullYValues(0) - 35)

const batteryX = width - 150 - 62
powerSvg.append("rect")
    .attr("id", "power-rect")
    .attr('width', 50)
    .attr("height", 20)
    .attr("x", batteryX)
    .attr("y", margins.top - 15)
powerSvg.append("rect")
    .attr("id", "power-rect-decorator")
    .attr('width', 4)
    .attr("height", 10)
    .attr("x", batteryX + 50)
    .attr("y", margins.top - 10)

powerCurveSvg.append("text")
    .text("Effect Size (Alternative Hypothesis)")
    .style("text-anchor", "middle")
    .attr("x", powerCurveWidth / 2)
    .attr("y", powerCurveHeight - 10)
powerCurveSvg.append("text")
    .attr("id", "power-curve-y-label")
    .text("Power")
    .attr('transform', `rotate(-90)`)
    .attr("y", margins.left - 50)
    .attr("x", 0 - (powerCurveHeight/ 2))
    .style("text-anchor", "middle")

const line = d3.line()
    .x(d => powerXValues(d.x))
    .y(d => powerYValues(d.y))
const powerCurveLine = d3.line()
    .x(d => powerCurveXValues(d.x))
    .y(d => powerCurveYValues(d.y))
    
function graphDistribution(svg, data, id) {
    svg.append("path")
        .attr("class", "curve")
        .attr("id", id)
        .data([data])
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
}

function updateDistributions(svg, effectSize, sampleSize){
    svg.selectAll(".curve").remove();
    svg.selectAll(".pop-mean-text").remove();

    se = sd / Math.sqrt(sampleSize);
    function h1Pdf(x) {
        return normalPdf(x, effectSize, se)
    }

    distribution1 = generateNormalData(xRange, 0, se);
    distribution2 = generateNormalData(xRange, effectSize, se);
    graphDistribution(svg, distribution1, "distribution-1");
    graphDistribution(svg, distribution2, "distribution-2");

    svg.append("text")
        .attr("class", "pop-mean-text")
        .attr("id", "h0-pop-mean-text")
        .text("h0: x̄ = 0")
        .attr("x", powerXValues(0) - 30)
        .attr("y", powerYValues(distribution1.find(d => d.x == 0).y) - 20)

    svg.append("text")
        .attr("class", "pop-mean-text")
        .attr("id", "h1-pop-mean-text")
        .text(`h1: x̄ = ${effectSize}`)
        .attr("x", (powerXValues(effectSize) < (powerXValues(h0Mean) + 90)) ? (powerXValues(h0Mean) + 60) : powerXValues(effectSize) - 30)
        .attr("y", powerYValues(h1Pdf(effectSize)) - 20)

}

function updateSignificance(svg, alpha) {
    svg.selectAll(".dynamic").remove()

    function h0Pdf(x) {
        return normalPdf(x, h0Mean, se)
    }
    function h1Pdf(x) {
        return normalPdf(x, effectSize, se)
    }
    let criticalValue = reverseLookupAreaUnderCurve(h0Pdf, 1, 0.001, alpha)
    let power = roundDecimal(areaUnderCurve(h1Pdf, criticalValue, d3.extent(xRange)[1], 0.001), 2)
    svg.append("line")
        .attr("id", "h0-alpha-line")
        .attr("class", "dynamic")
        .attr("x1", powerXValues(criticalValue))
        .attr("x2", powerXValues(criticalValue))
        .attr("y1", height - margins.bottom)
        .attr("y2", powerYValues(h0Pdf(criticalValue)))
    
    svg.append("text")
        .text(`α=${alpha}`)
        .attr("id", "alpha-text")
        .attr("class", "dynamic")
        .attr("x", powerXValues(criticalValue))
        .attr("y", height - margins.bottom + 40)
    
    let h1Area = d3.area()
        .x0((d) => {return powerXValues(d.x)})
        .y0(height - margins.bottom)
        .y1((d) => {return powerYValues(d.y)})
    svg.append("path")
        .datum(distribution2.filter((d) => d.x >= criticalValue))
        .attr("id", "power-area")
        .attr("class", "dynamic")
        .attr("d", h1Area)
        .lower()
    svg.append("text")
        .attr("id", "power-text")
        .attr("class", "dynamic")
        .text(`power = ${roundDecimal(power, 3)}`)
        .attr("x", width - 150)
        .attr("y", margins.top)
    svg.append("rect")
        .attr("id", "power-rect-level")
        .attr("class", "dynamic")
        .attr('width', 44 * power)
        .attr("height", 14)
        .attr("x", batteryX + 3)
        .attr("y", margins.top - 12)
}

function updatePowerCurve(alpha, effectSize, sampleSize) {
    let se = sd / Math.sqrt(sampleSize)
    function powerCurveH0Pdf(x) {
        return normalPdf(x, 0, se)
    }

    let criticalValue = reverseLookupAreaUnderCurve(powerCurveH0Pdf, 1.0, 0.001, alpha)
    let altMeans = d3.range(0, 1, 0.001)
    let altPowerValues = altMeans.map((altMean) => {
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
        .attr("y1", powerCurveHeight - margins.bottom)
        .attr("y2", 0)
    powerCurveSvg.append("line")
        .attr("id", "power-curve-power-value")
        .attr("x1", margins.left)
        .attr("x2", powerCurveWidth)
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
        .attr("y", powerCurveHeight - margins.bottom)
}

updateDistributions(compareDistrSvg, effectSize, sampleSize)
updateDistributions(powerSvg, effectSize, sampleSize)
updateSignificance(powerSvg, alpha)
updatePowerCurve(alpha, effectSize, sampleSize)

export function transitionAUCPower() {
    function h1Pdf(x) {
        return normalPdf(x, effectSize, se)
    }
    let power = roundDecimal(areaUnderCurve(h1Pdf, criticalValue, d3.extent(xRange)[1], 0.001), 2)
    compareDistrSvg.append("text")
        .attr("id", "null-distr-p-value")
        .text("p = 0.05")
        .attr("x", nullXValues(0.3))
        .attr("y", nullYValues(0) - 35)
    // let h1Area = d3.area()
    //     .x0((d) => {return powerXValues(d.x)})
    //     .y0(height - margins.bottom)
    //     .y1((d) => {return powerYValues(d.y)})
    //     .curve(d3.curveMonotoneX)
    // let h1Curve = compareDistrSvg.append("path")
    //     .attr("id", "distribution-2")
    //     .attr("class", "curve")
    //     .data([distribution2])
    //     .attr("fill", "none")
    //     .attr("d", line)
    // let h1CurveLength = h1Curve.node().getTotalLength();
    // h1Curve.attr("stroke-dasharray", `${h1CurveLength} ${h1CurveLength}`)
    //     .attr("stroke-dashoffset", h1CurveLength)
    //         .transition()
    //         .ease(d3.easeLinear)
    //         .attr("stroke-dashoffset", 0)
    //         .duration(600)
    let clip = compareDistrSvg.append("clipPath")
        .attr("id", "clip")
        .attr("class", "dynamic")
    let clipRect = clip.append("rect")
        .attr("width", 0)
        .attr("height", height)
    let area = d3.area()
        .x(d => nullXValues(d.x))
        .y1(d => nullYValues(d.y))
        .y0(height - margins.bottom)
    compareDistrSvg.append("path")
        .datum(distribution2.filter((d) => d.x >= criticalValue))
        .attr("id", "power-area")
        .attr("class", "dynamic")
        .attr("d", area)
        .attr("clip-path", "url(#clip)")
    clipRect.transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("width", width)
    compareDistrSvg.append("text")
        .attr("id", "power-text")
        .text(`power = ${roundDecimal(areaUnderCurve(h1Pdf, criticalValue, d3.extent(xRange)[1], 0.001), 2)}`)
        .attr("x", (3/4) * width)
        .attr("y", (1/2) * height)
        .style("opacity", 0)
        .transition()
        .delay(1000)
        .duration(1000)
        .style("opacity", 100)
}

export function resetAUCPower() {
    compareDistrSvg.selectAll(".dynamic").remove()
    compareDistrSvg.select("#power-text").remove()
}

export function showDefinitions() {
    document.querySelector("#page3-text").style.display = "block"
    document.querySelector("#page3b-text").style.display = "none"
    document.querySelector("#definitions").style.display = "block"
    powerSvg.attr("transform", "scale(1)")
}

export function hideDefinitions() {
    document.querySelector("#page3-text").style.display = "none"
    document.querySelector("#page3b-text").style.display = "block"
    document.querySelector("#definitions").style.display = "none"
    powerSvg.attr("transform", "scale(0.8)")
    powerSvg.style("width", `${0.95 * width}px`)
    powerSvg.style("height", `${0.95 * height}px`)
}