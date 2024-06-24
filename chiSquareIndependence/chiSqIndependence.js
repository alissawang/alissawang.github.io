import { chiSqValue, chiSqDistribution, reverseLookupAreaUnderCurve, sum, roundDecimal } from "../utils/math.js"
import { drawDistribution } from "../utils/graph.js"

const type1A = 70
const type1B = 112
const type1C = 70
const type1D = 49

const type2A = 40
const type2B = 96
const type2C = 198
const type2D = 165

const sumA = type1A + type2A
const sumB = type1B + type2B
const sumC = type1C + type2C
const sumD = type1D + type2D
const type1Values = [type1A, type1B, type1C, type1D]
const type2Values = [type2A, type2B, type2C, type2D]
const sumValues = [sumA, sumB, sumC, sumD]

const groupIds = ["a", "b", "c", "d"]
groupIds.forEach((groupId, idx) => {
    let type1 = type1Values.at(idx);
    let type2 = type2Values.at(idx);
    let type1Classes = document.getElementsByClassName(`type1-${groupId}`)
    Array.prototype.forEach.call(type1Classes, function(element) {element.innerHTML = type1})
    let type2Classes = document.getElementsByClassName(`type2-${groupId}`)
    Array.prototype.forEach.call(type2Classes, function(element) {element.innerHTML = type2})
    let sum = document.getElementById(`sum-${groupId}`)
    sum.innerHTML = sumValues.at(idx);
    let sumMultiply = document.getElementById(`sum-${groupId}-multiply`)
    sumMultiply.innerHTML = sumValues.at(idx);
})

document.getElementById("total-lt5").innerHTML = sum(type1Values);
document.getElementById("total-gt5").innerHTML = sum(type2Values);
const total = sum(type1Values) + sum(type2Values)
document.getElementById("total").innerHTML = total

const proportionLt5 = roundDecimal(sum(type1Values) / total, 2)
const proportionGt5 = roundDecimal(sum(type2Values) / total, 2)
const totalLt5Display = document.getElementsByClassName("total-lt5-compute")
Array.prototype.forEach.call(totalLt5Display, function(element) {element.innerHTML = sum(type1Values)})
const totalGt5Display = document.getElementsByClassName("total-gt5-compute")
Array.prototype.forEach.call(totalGt5Display, function(element) {element.innerHTML = sum(type2Values)})
const proportionLt5Display = document.getElementsByClassName("proportion-lt5-compute")
Array.prototype.forEach.call(proportionLt5Display, function(element) {element.innerHTML = proportionLt5})
const proportionGt5Display = document.getElementsByClassName("proportion-gt5-compute")
Array.prototype.forEach.call(proportionGt5Display, function(element) {element.innerHTML = proportionGt5})


const type1ByGroup = groupIds.map(id => d3.select(`#type1-${id}-multiply`))
const type2ByGroup = groupIds.map(id => d3.select(`#type2-${id}-multiply`))
const green = "#cfe69e"
const blue = "#d9f9ff"
const expectedType1 = sumValues.map(sum => roundDecimal(proportionLt5 * sum, 2))
const expectedType2 = sumValues.map(sum => roundDecimal(proportionGt5 * sum, 2))
const chiSq = chiSqValue(type1Values.concat(type2Values), expectedType1.concat(expectedType2))

groupIds.forEach((id, idx) => {
    document.getElementById(`type1-${id}-expected`).innerHTML = expectedType1.at(idx)
    document.getElementById(`type2-${id}-expected`).innerHTML = expectedType2.at(idx)
})

const chiSqElement1 = document.getElementById("chisq-computation-1")
const chiSqElement2 = document.getElementById("chisq-computation-2")

const fractionsType1 = groupIds.map((groupId, idx) => generateChiSqFractionHTML(
    `type1-group-${groupId}-diff`, type1Values[idx], expectedType1[idx]
))
const fractionsType2 = groupIds.map((groupId, idx) => generateChiSqFractionHTML(
    `type2-group-${groupId}-diff`, type2Values[idx], expectedType2[idx]
))

function generateChiSqFractionHTML(divId, observed, expected) {
    return `<div class="fraction" id="${divId}">
    <span>(${observed}-${expected})<sup>2</sup></span>
    <span class="denominator">${expected}</span>
    </div>`
}

export function expectedValuesTransition(){
    for (let i = 0; i < type1ByGroup.length; i++) {
            setTimeout(function () {
            let cell1 = type1ByGroup.at(i);
            let cell2 = type2ByGroup.at(i);
            cell1.transition()
                .style("background-color", green)
                .text(`x ${proportionLt5}`)
                .style("font-weight", "bold")
            cell2.transition()
                .style("background-color", blue)
                .text(`x ${proportionGt5}`)
                .style("font-weight", "bold")
            cell1.transition()
                .delay(500)
                .text(expectedType1[i])
                .style("font-weight", "normal")
            cell2.transition()
                .delay(500)
                .text(expectedType2[i])
                .style("font-weight", "normal")
            }, 500*i)
    }
}

export function expectedValuesReset() {
    type1ByGroup.map(element => element.text("").style("background-color", "white"))
    type2ByGroup.map(element => element.text("").style("background-color", "white"))
}

export function chiSqTransition() {
    for (let i = 0; i < groupIds.length * 2; i++) {
        setTimeout(function() {
            let type = (i <= 3) ? 1 : 2
            let frac = (i <= 3) ? fractionsType1[i] : fractionsType2[i-4]
            let groupId = (i <= 3) ? groupIds[i] : groupIds[i-4]
            let chiSqElement = (i <= 3) ? chiSqElement1 : chiSqElement2
            let highlightColor = (i <=3 ) ? green : blue
            let observedElement = d3.select(`#type${type}-${groupId}-observed`)
            let expectedElement = d3.select(`#type${type}-${groupId}-expected`)

            chiSqElement.innerHTML += (i > 0) ? ` + ${frac}` : frac
            let fracElement = d3.select(`#type${type}-group-${groupId}-diff`)
            fracElement.transition().style("background-color", highlightColor)
            observedElement.transition().style("background-color", highlightColor)
            expectedElement.transition().style("background-color", highlightColor)
            fracElement.transition().delay(400).style("background-color", "white")
            observedElement.transition().delay(400).style("background-color", "white")
            expectedElement.transition().delay(400).style("background-color", "white")

            if (i == groupIds.length * 2 - 1) {
                d3.select("#chisq-equals")
                    .transition()
                    .delay(600)
                    .text(`= ${roundDecimal(chiSq, 2)}`)
            }
        }, i * 600)
    }
}

export function chiSqReset() {
    chiSqElement1.innerHTML = ""
    chiSqElement2.innerHTML = ""
    d3.select("#chisq-equals").innerHTML = ""
}