import { chiSqValue, chiSqDistribution, reverseLookupAreaUnderCurve } from "../../utils/math.js"
import { graphDoFCurves } from "../chiSq.js"

const observedADisplay = document.getElementById("observed-a")
const observedBDisplay = document.getElementById("observed-b")
const observedCDisplay = document.getElementById("observed-c")
const observedDDisplay = document.getElementById("observed-d")

const observedA = 30
const observedB = 20
const observedC = 27
const observedD = 19
const observedValues = [observedA, observedB, observedC, observedD]
observedADisplay.innerHTML = observedA
observedBDisplay.innerHTML = observedB
observedCDisplay.innerHTML = observedC
observedDDisplay.innerHTML = observedD

const expectedADisplay = document.getElementById("expected-a")
const expectedBDisplay = document.getElementById("expected-b")
const expectedCDisplay = document.getElementById("expected-c")
const expectedDDisplay = document.getElementById("expected-d")

const expectedA = 25
const expectedB = 25
const expectedC = 25
const expectedD = 25
expectedADisplay.innerHTML = expectedA
expectedBDisplay.innerHTML = expectedB
expectedCDisplay.innerHTML = expectedC
expectedDDisplay.innerHTML = expectedD

const groupADiffDisplay = document.getElementById("group-a-diff")
const groupBDiffDisplay = document.getElementById("group-b-diff")
const groupCDiffDisplay = document.getElementById("group-c-diff")
const groupDDiffDisplay = document.getElementById("group-d-diff")

groupADiffDisplay.innerHTML = `(${observedA} - ${expectedA})<sup>2</sup>`
groupBDiffDisplay.innerHTML = `(${observedB} - ${expectedB})<sup>2</sup>`
groupCDiffDisplay.innerHTML = `(${observedC} - ${expectedC})<sup>2</sup>`
groupDDiffDisplay.innerHTML = `(${observedD} - ${expectedD})<sup>2</sup>`

const chiSqGoFDisplay = document.getElementById("chi-sq-value")
const chiSqGoF = chiSqValue(
    [observedA, observedB, observedC, observedD],
    [expectedA, expectedB, expectedC, expectedD]
)
chiSqGoFDisplay.innerHTML = chiSqGoF
const chiSqStatement = document.getElementById("chi-squared-statement")
chiSqStatement.innerHTML = `Our chi-squared value is ${chiSqGoF}.`

const lightblue = "#defaff"
const green = "#d8edaf"
const lightpink = "#f4e4f5"
const yellow = "#fff3a6"

var degreesOfFreedom = observedValues.length - 1
var degreesOfFreedomDisplay = document.getElementById("dof-value")

function transitionHighlights(groupNames) {
    let colors = [lightblue, green, lightpink, yellow]
    let highlightTimeMs = 300
    for (let i = 0; i < groupNames.length; i++) {
        setTimeout(function () {
            let color = colors.at(i)
            let groupName = groupNames.at(i);
            let observed = d3.select(`#observed-${groupName}`)
            let expected = d3.select(`#expected-${groupName}`)
            let stat = d3.select(`#group-${groupName}-stat`)
            observed.transition()
                .style("background-color", color)
                .transition()
                .delay(highlightTimeMs)
                .style("background-color", "none");
            expected.transition()
                .style("background-color", color)
                .transition()
                .delay(highlightTimeMs)
                .style("background-color", "none");
            stat.transition()
                .style("background-color", color)
                .transition()
                .delay(highlightTimeMs)
                .style("background-color", "none")
        }, 400 * i);
     }
}

const width = 700
const height = 400
const margins = ({
    top: 40,
    right: 80,
    bottom: 50,
    left: 80
})
const chiSqDistrSvg = d3.select("#dof-curves-graph1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const chiSqDistrSvg2 = d3.select("#dof-curves-graph2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const chiSqDistrSvg3 = d3.select("#dof-curves-graph3")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const pink = "#ffc7e9"
const blue = "#9ce2f7"
const colors = [pink, "orange", "gold", green, blue]
const degreesOfFreedomCurves = d3.range(1, 6)

graphDoFCurves(chiSqDistrSvg, degreesOfFreedomCurves)
graphDoFCurves(chiSqDistrSvg2, degreesOfFreedomCurves)
var [ chiSqGraphXValues, chiSqGraphYValues ]  = graphDoFCurves(chiSqDistrSvg3, [3])

chiSqDistrSvg3.append("line")
    .attr("id", "graph-chisq-line")
    .attr("x1", chiSqGraphXValues(chiSqGoF))
    .attr("x2", chiSqGraphXValues(chiSqGoF))
    .attr("y1", height - margins.bottom)
    .attr("y2", margins.top)
    .style("stroke", "black")
chiSqDistrSvg3.append("text")
    .text(`χ2 = ${chiSqGoF}`)
    .attr("id", "graph-chisq-text")
    .attr("x", chiSqGraphXValues(chiSqGoF))
    .attr("y", height - (margins.bottom / 2))
    .style("stroke", "black")

const gray = "#dbdbdb"
var unselectedDofs = degreesOfFreedomCurves.filter(dof => dof != degreesOfFreedom)

function selectedDistribution(x) {
    return chiSqDistribution(x, degreesOfFreedom)
}
let criticalValue = reverseLookupAreaUnderCurve(selectedDistribution, 100, 0.001, 0.05)

var alphaArea = d3.area()
    .x((d) => {return chiSqGraphXValues(d.x)})
    .y0(height - margins.bottom)
    .y1((d) => {return chiSqGraphYValues(d.y)})
chiSqDistrSvg3.append("path")
    .datum(d3.range(criticalValue, 10, 0.01).map(x => {return {"x": x, "y": selectedDistribution(x)}}))
    .attr("id", "alpha-area")
    .attr("class", "area")
    .attr("d", alphaArea)
    .lower()
chiSqDistrSvg3.append("text")
    .attr("id", "alpha-text")
    .text("α = 0.05")
    .attr("x", chiSqGraphXValues(8))
    .attr("y", 300)

var groupNames = ["a", "b", "c", "d"]

export function page1Transition() {
    transitionHighlights(groupNames)
}

export function page1Reset() {
    d3.selectAll(".highlight-cell").style("background-color", "transparent")
    d3.selectAll(".fraction").style("background-color", "transparent")
}

export function page3Transition() {
    for (let i = 0; i < groupNames.length - 1; i++) {
        setTimeout(function() {
            var groupName = groupNames.at(i)
            var value = observedValues.at(i)
            var group = document.getElementById(`observed-${groupName}-dof`)
            group.innerHTML = value
            if (i == groupNames.length - 2) {
                var lastGroupName = groupNames.at(-1)
                var lastGroup = document.getElementById(`observed-${lastGroupName}-dof`)
                lastGroup.style.backgroundColor = "#e6e6e6"
                lastGroup.innerHTML = observedValues.at(-1)
                degreesOfFreedomDisplay.innerHTML = degreesOfFreedom
            }
        }, 400 * i)
    }
}

export function page3Reset() {
    var resetGroups = groupNames
        .slice(1, groupNames.length)
        .map((name) => document.getElementById(`observed-${name}-dof`))
    resetGroups.map((group) => group.innerHTML = "")
    degreesOfFreedomDisplay.innerHTML = ""
}

export function page4Transition() {
    unselectedDofs.map(i => d3.selectAll(`#dof-curve-${i}`).lower().transition().delay(400).style("stroke", gray))
    unselectedDofs.map(i => d3.selectAll(`#dof-curve-${i}`).lower().transition().delay(400).style("opacity", 0))
}

export function page4Reset() {
    degreesOfFreedomCurves.map((dOF, idx) => d3.selectAll(`#dof-curve-${dOF}`).style("opacity", 100).style("stroke", colors.at(idx)))
}