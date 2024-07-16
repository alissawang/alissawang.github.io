import { FDistribution, areaUnderCurve, roundDecimal } from "../utils/math.js";
import { drawDistribution, transitionArea } from "../utils/graph.js";
import { colors } from "../utils/constants.js";
import { n, f, groupIds } from "./anovaOneWay.js"

const width = 600
const height = 400
const margins = {
    top: 10,
    left: 30,
    right: 30,
    bottom: 40
}
const exampleDof1 = groupIds.length - 1
const exampleDof2 = (n - 1) * groupIds.length
const xRange = d3.range(0, 10, 0.001);
const svg = d3.select("#f-distributions")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const exampleFs = [[3, 15], [4, 30], [2, 59], [5, 80], [8, 100]]
function exampleFDistribution(x) {
    return FDistribution(x, exampleDof1, exampleDof2)
}
const exampleFDistrData = xRange.map((d => {return {"x": d, "y": exampleFDistribution(d)}}))
var graphValues;
function graphExampleFs(svg, exampleDOFs, width, height, margins){
    exampleDOFs.forEach((dofPair, idx) => {
        let dof1 = dofPair[0];
        let dof2 = dofPair[1];
        function FDistributionPartial(input) {
            return FDistribution(input, dof1, dof2)
        }
        let graphData = xRange.map((d => {return {"x": d, "y": FDistributionPartial(d)}}));
        let id = `dof-${dof1}-${dof2}`
        let color = colors[idx]
        graphValues = drawDistribution(svg, graphData, width, height, margins, {"id": id, "strokeColor": color, "yExtent": [0, 1]})
    })

    svg.selectAll("legend-labels")
        .data(colors)
        .enter()
        .append("rect")
            .attr("x", width - margins.right - 200)
            .attr("y", (color, idx) => 50 + (idx * 20))
            .attr("width", 30)
            .attr("height", 5)
            .style("fill", (color, idx) => colors.at(idx))
    svg.append("text")
        .text("Degrees of Freedom")
        .attr("x", width - margins.right - 160)
        .attr("y", 30)
        .style("text-anchor", "left")
    svg.selectAll("legend-labels-text")
        .data(colors)
        .enter()
        .append("text")
            .attr("x", width - margins.right - 150)
            .attr("y", (color, idx) => 58 + (idx * 20))
            .text((color, idx) => `df₁=${exampleFs[idx][0]}, df₂=${exampleFs[idx][1]}`)
            .style("fill", (color, idx) => colors.at(idx))
            .style("font-weight", "bold")
}

export function dofTransition() {
    let gray = "#dbdbdb"
    let p = areaUnderCurve(exampleFDistribution, f, 10, 0.01)
    graphExampleFs(svg, exampleFs, width, height, margins)
    exampleFs.forEach(pair => {
        let dof1 = pair[0]
        let dof2 = pair[1]
        if (dof1 != exampleDof1 & dof2 != exampleDof2) {
            svg.select(`#dof-${dof1}-${dof2}`).lower().transition().delay(800).duration(300).style("stroke", gray).style("opacity", 0)
        }
    })
    setTimeout(function() {
        transitionArea(svg, f, exampleFDistrData, graphValues[0], graphValues[1], width, height, margins)
        svg.append("text")
            .text(`F=${roundDecimal(f, 2)}`)
            .attr("x", graphValues[0](f))
            .attr("y", height - 5)
            .style("fill", "red")
            .style("font-weight", "bold")
        svg.append("line")
            .lower()
            .attr("id", "f-score-line")
            .attr("x1", graphValues[0](f))
            .attr("x2", graphValues[0](f))
            .attr("y1", graphValues[1](0) + 10)
            .attr("y2", graphValues[1](exampleFDistribution(f)))
        svg.append("text")
            .transition()
            .delay(600)
            .text(`p=${roundDecimal(p, 2)}`)
            .attr("x", graphValues[0](4))
            .attr("y", height - 100)
            .style("fill", "red")
            .style("font-weight", "bold")
    }, 1500)
}
dofTransition()