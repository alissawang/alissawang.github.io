export function drawDistribution(svg, dataArray, width, height, margins) {
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
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
    svg.append("path")
        .attr("class", "curve")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke-opacity", 0)
        .attr("stroke", "white")
        .attr("stroke-width", 50)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
        .on("mousemove", function(event, d) {
            d3.select(this)

            svg.selectAll(".coord-circle").remove()

            let coords = d3.mouse(this)
            let xRaw = xGraphValues.invert(coords[0])
            let x = d3.format(".2f")(xRaw)
            let yRaw = dataArray.find(d => d.x == x).y
            let y = d3.format(".2f")(yRaw)
            let coordsText = "Observed mean: " + x + " mins <br>Probability: " + y

            d3.select(".coordinate-display")
                .style("opacity", 1)
                .html(coordsText)
                .style("left", coords[0] + 100 + "px")
                .style("top", coords[1] + 150 + "px")

            svg
                .append("circle")
                .attr("class", "coord-circle")
                .attr("cx",  coords[0] + "px")
                .attr("cy", yGraphValues(yRaw) + "px")
                .attr("r", "10px")
                .style("fill", "steelblue")
        })

}