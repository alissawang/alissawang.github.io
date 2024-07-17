import { FDistribution, areaUnderCurve, roundDecimal, reverseLookupAreaUnderCurve } from "../utils/math.js";
import { drawDistribution, transitionArea, addTextSvg } from "../utils/graph.js";
import { colors } from "../utils/constants.js";
import { n, f, groupIds } from "./anovaOneWay.js"

const width = 600
const height = 600
const margins = {
    top: 100,
    left: 30,
    right: 30,
    bottom: 200
}
const exampleDof1 = groupIds.length - 1
const exampleDof2 = (n - 1) * groupIds.length
const xRange = d3.range(0, 10, 0.001);
const svg = d3.select("#f-distributions")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
const exampleFs = [[3, 15], [4, 30], [exampleDof1, exampleDof2], [5, 80], [8, 100]]
function exampleFDistribution(x) {
    return FDistribution(x, exampleDof1, exampleDof2)
}
const exampleFDistrData = xRange.map((d => {return {"x": d, "y": exampleFDistribution(d)}}))
const criticalValue = reverseLookupAreaUnderCurve(
    exampleFDistribution,
    10,
    0.001,
    0.05
)

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
        graphValues = drawDistribution(svg, graphData, width, height, margins, {"id": id, "class": "dynamic", "strokeColor": color, "yExtent": [0, 1]})
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
    let x = 5
    let treatmentY = height - 90
    let errorY = treatmentY + 80

    addTextSvg(svg, "dfₖ", x, treatmentY, "df-treatment", "dof-text-treatment")
    addTextSvg(svg, "=", x + 70, treatmentY, "df-treatment-equals", "dof-text-treatment")
    addTextSvg(svg, "# groups - 1", x + 140, treatmentY, "df-treatment-formula", "dof-text-treatment")
    addTextSvg(svg, "=", x + 400, treatmentY, "df-treatment-equals-2", "dof-text-treatment")
    addTextSvg(svg, exampleDof1, x + 450, treatmentY, "df-treatment-value", "dof-text-treatment")

    addTextSvg(svg, "dfₙ", x, errorY, "df-error", "dof-text-error")
    addTextSvg(svg, "=", x + 70, errorY, "df-error-equals", "dof-text-error")
    addTextSvg(svg, "(n - 1) × # groups", x + 120, errorY, "df-error-formula", "dof-text-error")
    addTextSvg(svg, "=", x + 400, errorY, "df-error-equals-2", "dof-text-error")
    addTextSvg(svg, exampleDof2, x + 450, errorY, "df-error-value", "dof-text-error")
    setTimeout(function () {
        svg.select("#df-treatment-formula").remove()
        svg.select("#df-treatment-equals-2").remove()
        svg.selectAll(".dof-text-treatment")
            .transition()
            .ease(d3.easeLinear)
            .attr("y", 25)
        svg.select("#df-treatment-value")
            .transition()
            .ease(d3.easeLinear)
            .attr("x", x + 120)
            .attr("y", 25)
        svg.select("#df-error-formula").remove()
        svg.select("#df-error-equals-2").remove()
        svg.selectAll(".dof-text-error")
            .transition()
            .ease(d3.easeLinear)
            .attr("y", 60)
        svg.select("#df-error-value")
            .transition()
            .ease(d3.easeLinear)
            .attr("x", x + 120)
            .attr("y", 60)
    }, 700)

    let p = areaUnderCurve(exampleFDistribution, f, 10, 0.01)
    graphExampleFs(svg, exampleFs, width, height, margins)
    var [ graphXValues, graphYValues ] = graphValues;
    exampleFs.forEach(pair => {
        let dof1 = pair[0]
        let dof2 = pair[1]
        if (dof1 != exampleDof1 & dof2 != exampleDof2) {
            svg.select(`#dof-${dof1}-${dof2}`).lower().transition().delay(1400).duration(300).style("opacity", 0)
        }
    })
    setTimeout(function() {
        addTextSvg(
            svg, 
            `F=${roundDecimal(criticalValue, 2)}`, 
            graphXValues(criticalValue), 
            height - margins.bottom + 30,
            "critical-value-text", 
            "dynamic"
        )
        svg.append("line")
            .lower()
            .attr("id", "critical-value-line")
            .attr("class", "dynamic")
            .attr("x1", graphXValues(criticalValue))
            .attr("x2", graphXValues(criticalValue))
            .attr("y1", graphYValues(0) + 10)
            .attr("y2", graphYValues(0) + 10)
            .transition()
            .attr("y2", graphYValues(exampleFDistribution(criticalValue)))
        addTextSvg(
            svg, 
            "p < 0.05", 
            graphXValues(criticalValue) + 25, 
            graphYValues(exampleFDistribution(criticalValue)) - 10,
            "p-05-text", 
            "dynamic"
        )
        transitionArea(svg, f, exampleFDistrData, graphXValues, graphYValues, width, height, margins)
        svg.append("text")
            .attr("class", "dynamic")
            .text(`F=${roundDecimal(f, 2)}`)
            .attr("x", graphXValues(f))
            .attr("y", height - margins.bottom + 30)
            .style("fill", "red")
            .style("font-weight", "bold")
        svg.append("line")
            .lower()
            .attr("id", "f-score-line")
            .attr("class", "dynamic")
            .attr("x1", graphXValues(f))
            .attr("x2", graphXValues(f))
            .attr("y1", graphYValues(0) + 10)
            .attr("y2", graphYValues(0) + 10)
            .transition()
            .attr("y2", graphYValues(exampleFDistribution(f)))
        svg.append("text")
            .text(`p=${roundDecimal(p, 2)}`)
            .attr("class", "dynamic")
            .attr("x", graphXValues(f) + 40)
            .attr("y", height - margins.bottom - 100)
            .style("fill", "red")
            .style("font-weight", "bold")
            .style("opacity", "0%")
            .transition()
            .delay(600)
            .style("opacity", "100%")
        document.getElementById("conclusion").style.display = "block"
    }, 1800)
}

export function dofReset() {
    svg.selectAll(".dof-text-treatment").remove()
    svg.selectAll(".dof-text-error").remove()
    svg.selectAll(".dynamic").remove()
    document.getElementById("conclusion").style.display = "none"
}