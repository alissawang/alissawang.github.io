import { chiSqDistribution } from "../utils/math.js"
import { drawDistribution } from "../utils/graph.js"

const pink = "#ffc7e9"
const blue = "#9ce2f7"
const green = "#d8edaf"
const colors = [pink, "orange", "gold", green, blue]
const width = 700
const height = 400
const margins = ({
    top: 40,
    right: 80,
    bottom: 50,
    left: 80
})

const xRange = d3.range(0.01, 10, 0.01)
const degreesOfFreedomCurves = d3.range(1, 7)
const chiSqDistrArrays = degreesOfFreedomCurves.map(dof => {return {"dof": dof, "data": generateChiSqDistrData(dof)}})

function generateChiSqDistrData(dof) {
    return xRange.map(function(d) {return {"x": d, "y": chiSqDistribution(d, dof)}})
}

export function graphDoFCurves(svg, dofs) {
    var chiSqGraphValues;
    for (let i = 0; i < dofs.length; i++) {
        let currentDoF = dofs.at(i)
        let chiSqDistrArray = chiSqDistrArrays.find(d => d.dof == currentDoF).data
        chiSqGraphValues = drawDistribution(
            svg, 
            chiSqDistrArray, 
            width, 
            height, 
            margins,
            [0, 1],
            false,
            colors.at(currentDoF - 1),
            3,
            `dof-curve-${currentDoF}`
        )
        svg.selectAll("legend-labels")
            .data(colors)
            .enter()
            .append("rect")
                .attr("x", width - margins.right - 100)
                .attr("y", (color, idx) => 50 + (idx * 20))
                .attr("width", 30)
                .attr("height", 5)
                .style("fill", (color, idx) => colors.at(idx))
        svg.append("text")
            .text("Degrees of Freedom")
            .attr("x", width - margins.right - 100)
            .attr("y", 30)
            .style("text-anchor", "left")
        svg.selectAll("legend-labels-text")
            .data(colors)
            .enter()
            .append("text")
                .attr("x", width - margins.right - 50)
                .attr("y", (color, idx) => 58 + (idx * 20))
                .text((color, idx) => idx + 1)
                .style("fill", (color, idx) => colors.at(idx))
    }

    return chiSqGraphValues
}