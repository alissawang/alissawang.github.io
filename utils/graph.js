export function drawDistribution(svg, dataArray, width, height, margins) {
    console.log(dataArray)
    let xDomain = d3.extent(dataArray, d => d.x)
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range([margins.left, width - margins.right])
    var yDomain = [Math.min(d3.min(dataArray, d => d.y), 0), Math.max(1, d3.max(dataArray, d => d.y))]
    let yGraphValues = d3.scaleLinear()
        .domain(yDomain).nice()
        .range([height - margins.bottom, margins.top])

    var line = d3.line()
        .x(d => xGraphValues(d.x))
        .y(d => yGraphValues(d.y))

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margins.bottom})`)
        .call(d3.axisBottom(xGraphValues)
            .ticks(width / 80)
            .tickSizeOuter(0))
    var yAxis = g => g
        .attr("transform", `translate(${margins.left},0)`)
        .call(d3.axisLeft(yGraphValues)
            .tickValues(d3.scaleLinear().domain(yGraphValues.domain()).ticks()))

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg.append("path")
        .attr("class", "curve")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
}
