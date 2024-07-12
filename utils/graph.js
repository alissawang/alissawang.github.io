import { generateNormalData } from "./data.js"
import { reverseLookupAreaUnderCurve } from "./math.js"

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

export function empty1DGraph(svg, xRange, width, height, margins, hideXAxis = false, hideYAxis = false) {
    let xDomain = d3.extent(xRange)
    let xGraphRange = [margins.left, width - margins.right]
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range(xGraphRange)

    var axisBottom;
    if (hideXAxis) {
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

export function drawNormalDistribution(
    svg,
    xRange,
    mean, 
    sd,
    width, 
    height, 
    margins, 
    kwargs
) {
    let normalData = generateNormalData(xRange, mean, sd)
    let [xGraphValues, yGraphValues] = drawDistribution(
        svg, normalData, width, height, margins, kwargs
    )
    return [xGraphValues, yGraphValues]
}

export function drawDistribution(
    svg,
    dataArray, 
    width, 
    height, 
    margins,
    kwargs={},
) {
    let yExtent = ("yExtent" in kwargs) ? kwargs.yExtent : undefined;
    let mouseover = ("mouseover" in kwargs) ? kwargs.mouseover : false;
    let strokeColor = ("strokeColor" in kwargs) ? kwargs.strokeColor : "#6bbfe3";
    let strokeWidth = ("strokeWidth" in kwargs) ? kwargs.strokeWidth : 5;
    let id = ("id" in kwargs) ? kwargs.id : "";
    let class_ = ("class" in kwargs) ? kwargs.class : "";
    let hideXAxis = ("hideXAxis" in kwargs) ? kwargs.hideXAxis : false;
    let hideYAxis = ("hideYAxis" in kwargs) ? kwargs.hideYAxis : false;

    let xDomain = d3.extent(dataArray, d => d.x)
    let xGraphValues = d3.scaleLinear()
        .domain(xDomain)
        .range([margins.left, width - margins.right])
    let yDomain = (yExtent) ? yExtent : [d3.min(dataArray, d => d.y), d3.max(dataArray, d => d.y)]
    let yGraphValues = d3.scaleLinear()
        .domain(yDomain).nice()
        .range([height - margins.bottom, margins.top])
    let line = d3.line()
        .x(d => xGraphValues(d.x))
        .y(d => yGraphValues(d.y))

    if (!hideXAxis) {
        let axisBottom = d3.axisBottom(xGraphValues).ticks(width / 80);
        let xAxis = g => g
            .attr("transform", `translate(0,${height - margins.bottom})`)
            .call(axisBottom)
        svg.append("g").call(xAxis);
    }

    if (!hideYAxis) {
        let axisLeft = d3.axisLeft(yGraphValues)
            .tickValues(
                d3.scaleLinear().domain(yGraphValues.domain()).ticks()
            )
        
        let yAxis = g => g
            .attr("transform", `translate(${margins.left},0)`)
            .attr("id", "y-axis")
            .call(axisLeft)
        svg.append("g").call(yAxis);
    }

    svg.append("path")
        .attr("id", id)
        .attr("class", class_)
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke", strokeColor)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)

    if (mouseover) {
        let invisibleCurve = svg.append("path")
            .data([dataArray])
            .attr("fill", "none")
            .attr("stroke-opacity", 0)
            .attr("stroke", "white")
            .attr("stroke-width", 50)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line)
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

export function graphAreaUnderCurve(svg, func, xRange, targetArea, graphXValues, graphYValues, height, margins, id, class_) {
    let dataArray = xRange.map(d => {return {"x": d, "y": func(d)}})
    let area = d3.area()
        .x0((d) => {return graphXValues(d.x)})
        .y0(height - margins.bottom)
        .y1((d) => {return graphYValues(d.y)})
    let criticalValue = reverseLookupAreaUnderCurve(func, d3.extent(xRange)[1], 0.001, targetArea)
    svg.append("path")
        .datum(dataArray.filter((d) => d.x >= criticalValue))
        .attr("id", `${id}-area`)
        .attr("class", class_)
        .attr("d", area)
        .lower()
    svg.append("line")
        .attr("id", `${id}-line`)
        .attr("x1", graphXValues(criticalValue))
        .attr("x2", graphXValues(criticalValue))
        .attr("y1", graphYValues(0))
        .attr("y2", graphYValues(func(criticalValue)))

    return criticalValue
}

export function addLegend(svg, colors, labels, x, y) {
    svg.selectAll("legend-labels")
        .data(colors)
        .enter()
        .append("rect")
            .attr("x", x)
            .attr("y", (color, idx) => y + 30 + (idx * 20))
            .attr("width", 30)
            .attr("height", 5)
            .style("fill", (color, idx) => colors[idx])
    svg.append("text")
        .text("Degrees of Freedom")
        .attr("x", x)
        .attr("y", y + 15)
        .style("text-anchor", "left")
        .style("font-size", 12)
        .style("font-weight", "bold")
    svg.selectAll("legend-labels-text")
        .data(colors)
        .enter()
        .append("text")
            .attr("x", x + 35)
            .attr("y", (color, idx) => y + 40 + (idx * 19))
            .text((color, idx) => labels[idx])
            .style("fill", (color, idx) => colors[idx])
            .style("font-size", 12)
            .style("font-weight", "bold")
}

export function graphMagnitudeLine(svg, x, y, width, tickHeight, id, class_= "") {
    svg.append("line")
        .attr("id", id)
        .attr("class", class_)
        .attr("x1", x - (width / 2))
        .attr("x2", x + (width / 2))
        .attr("y1", y)
        .attr("y2", y)
    svg.append("line")
        .attr("id", id)
        .attr("class", class_)
        .attr("x1", x - (width / 2))
        .attr("x2", x - (width / 2))
        .attr("y1", y - (tickHeight / 2))
        .attr("y2", y + (tickHeight / 2))
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 100)
    svg.append("line")
        .attr("id", id)
        .attr("class", class_)
        .attr("x1", x + (width / 2))
        .attr("x2", x + (width / 2))
        .attr("y1", y - (tickHeight / 2))
        .attr("y2", y + (tickHeight / 2))
}
    
export function addSquareRootSvg(svg, x, y, number, fontSize = null) {
    let chars = String(number).length
    svg.append("line")
        .attr("class", "frac-line")
        .attr("x1", x - 10)
        .attr("x2", x + chars * 20)
        .attr("y1", y)
        .attr("y2", y)
    svg.append("line")
        .attr("class", "frac-line")
        .attr("x1", x - 10)
        .attr("x2", x - 15)
        .attr("y1", y)
        .attr("y2", y + 20 * chars)
    svg.append("line")
        .attr("class", "frac-line")
        .attr("x1", x - 15)
        .attr("x2", x - 22)
        .attr("y1", y + 20 * chars)
        .attr("y2", y + 20 * chars - 15)
    svg.append("line")
        .attr("class", "frac-line")
        .attr("x1", x - 22)
        .attr("x2", x - 27)
        .attr("y1", y + 20 * chars - 15)
        .attr("y2", y + 20 * chars - 11)
    if (fontSize) {
        svg.append("text")
            .text(number)
            .attr("class", "denominator")
            .attr("x", x)
            .attr("y", y + fontSize)
            .style("font-size", fontSize)
    }
}