import { mean, roundDecimal } from "../utils/math.js"

export function graphSetUp(svg, yDomain, id, xlabel, height, width, margins) {
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
        .attr("x", width / 2 + margins.left)
        .attr("y", height - 10)
    return [xGraphValues, yGraphValues]
}


export function graphSample(svg, data, id, overallMean, width, xGraphValues, yGraphValues) {
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
        .attr("class", "group-mean-line")
        .attr("x1", 80)
        .attr("x2", 130)
        .attr("y1", yGraphValues(mean_))
        .attr("y2", yGraphValues(mean_))
    svg.append("text")
        .attr("class", `${id}-mean-text`)
        .text(`x̄: ${roundDecimal(mean_, 2)}`)
        .attr("x", 130)
        .attr("y", yGraphValues(mean_) + 5)
    return yGraphValues
}

export function graphSingleExample(svg, groupMean, overallMean, samplePoint, yGraphValues, width, margins) {
    svg.append("line")
        .attr("id", "tss-example-mean-line")
        .attr("x1", (width / 2) - 10)
        .attr("x2", (width / 2) + 10)
        .attr("y1", yGraphValues(groupMean))
        .attr("y2", yGraphValues(groupMean))
    svg.append("line")
        .attr("class", "overall-mean-line")
        .attr("x1", margins.left)
        .attr("x2", width - 30)
        .attr("y1", yGraphValues(overallMean))
        .attr("y2", yGraphValues(overallMean))
    svg.append("circle")
        .attr("id", "tss-example-point")
        .attr("r", 8)
        .attr("cx", width / 2)
        .attr("cy", yGraphValues(samplePoint))
    svg.append("text")
        .attr("class", "sample-point-text")
        .text(roundDecimal(samplePoint, 2))
        .attr("x", (width / 2) + 20)
        .attr("y", yGraphValues(samplePoint) + 5)
    svg.append("text")
        .attr("class", "group-a-sample-mean-text")
        .text(roundDecimal(groupMean, 2))
        .attr("x", (width / 2) + 20)
        .attr("y", yGraphValues(groupMean) + 5)
    svg.append("text")
        .attr("class", "overall-mean-text")
        .text(roundDecimal(overallMean, 2))
        .attr("x", (width / 2) + 50)
        .attr("y", yGraphValues(overallMean) + 5)
    svg.append("text")
        .attr("class", "overall-mean-text")
        .text("Overall mean")
        .style("text-anchor", "right")
        .attr("x", width + 20)
        .attr("y", yGraphValues(overallMean) + 5)
    svg.append("text")
        .attr("class", "group-a-sample-mean-text")
        .text("Group mean")
        .style("text-anchor", "right")
        .attr("x", width + 20)
        .attr("y", yGraphValues(groupMean) + 5)
    svg.append("text")
        .attr("class", "sample-point-text")
        .text("Sample point")
        .style("text-anchor", "right")
        .attr("x", width + 20)
        .attr("y", yGraphValues(samplePoint) + 5)
}