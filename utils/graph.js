export function emptyGraph(svg, xRange, yRange, width, height, margins) {
    let xDomain = d3.extent(xRange)
    let xGraphRange = [margins.left, width - margins.right]
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range(xGraphRange)
    let yDomain = d3.extent(yRange)
    let yGraphRange = [height - margins.bottom, margins.top]
    let yGraphValues = d3.scaleLinear()
        .domain(yDomain)
        .range(yGraphRange)
    
    let xAxis = g => g
        .attr("transform", `translate(0,${height - margins.bottom})`)
        .call(d3.axisBottom(xGraphValues)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )

    let yAxis = g => g
        .attr("transform", `translate(${margins.left},0)`)
        .call(d3.axisLeft(yGraphValues)
            .tickValues(d3.scaleLinear().domain(yGraphValues.domain()).ticks()))

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    return [xGraphValues, yGraphValues]
}

export function empty1DGraph(svg, xRange, width, height, margins, hideAxis = false) {
    let xDomain = d3.extent(xRange)
    let xGraphRange = [margins.left, width - margins.right]
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range(xGraphRange)

    var axisBottom;
    if (hideAxis) {
        axisBottom = d3.axisBottom(xGraphValues).tickValues([])
    } else {
        axisBottom = d3.axisBottom(xGraphValues).ticks(width / 80)
    }
    const xAxis = g => g
        .attr("transform", `translate(0,${height - margins.bottom})`)
        .call(axisBottom)
        .select(".domain").remove();
    svg.append("g").call(xAxis);
    return xGraphValues
}

export function drawDistribution(
    svg,
    dataArray, 
    width, 
    height, 
    margins, 
    yExtent=undefined,
    mouseover=false, 
    strokeColor="#6bbfe3", 
    strokeWidth = 5,
    id=""
) {
    let xDomain = d3.extent(dataArray, d => d.x)
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range([margins.left, width - margins.right])
    let yDomain = yExtent ? yExtent : [Math.min(d3.min(dataArray, d => d.y), 0), Math.max(1, d3.max(dataArray, d => d.y))]
    let yGraphValues = d3.scaleLinear()
        .domain(yDomain).nice()
        .range([height - margins.bottom, margins.top])

    let line = d3.line()
        .x(d => xGraphValues(d.x))
        .y(d => yGraphValues(d.y))

    let xAxis = g => g
        .attr("transform", `translate(0,${height - margins.bottom})`)
        .call(d3.axisBottom(xGraphValues)
            .ticks(width / 80)
            .tickSizeOuter(0))
    let yAxis = g => g
        .attr("transform", `translate(${margins.left},0)`)
        .call(d3.axisLeft(yGraphValues)
            .tickValues(d3.scaleLinear().domain(yGraphValues.domain()).ticks()))

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg.append("path")
        .attr("id", id)
        .attr("class", "curve")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke", strokeColor)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
    let invisibleCurve = svg.append("path")
        .attr("class", "curve")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke-opacity", 0)
        .attr("stroke", "white")
        .attr("stroke-width", 50)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)

    if (mouseover) {
        invisibleCurve.on("mousemove", function(event, d) {
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
                .style("fill", "#6bbfe3")
        })
    }
    return [xGraphValues, yGraphValues]
}

export function drawBarGraph(svg, dataArray, maxY, width, height, margins) {
    var xValues = [... new Set(dataArray.map(d => d.x))]
    var yRange = [0, maxY]

    var xAxis = d3.scaleBand()
        .domain(xValues)
        .range([margins.left, width - margins.right])
        .padding(0.2);
    var yAxis = d3.scaleLinear()
        .domain(yRange)
        .range([height - margins.bottom, margins.top])
    svg.append("g")
        .attr("transform", `translate(0, ${height - margins.bottom})`)
        .call(d3.axisBottom(xAxis));
    svg.append("g")
        .attr("transform", `translate(${margins.left},0)`)
        .call(d3.axisLeft(yAxis));
    svg.selectAll()
        .data(dataArray)
        .enter()
        .append("rect")
            .attr("x", (d) => xAxis(d.x))
            .attr("y", (d) => yAxis(d.y))
            .attr("width", xAxis.bandwidth())
            .attr("height", (d) => {return height - margins.bottom - yAxis(d.y)})
            .attr("fill", "#6bbfe3")

    return [xAxis, yAxis]
    }