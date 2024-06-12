import { drawDistribution } from "../utils/graph.js"
import { generateNormalData } from "../utils/data.js"

var margin = ({
    top: 40,
    right: 30,
    bottom: 70,
    left: 40
})
var width = 700
var height = 500

var svg = d3.select('#experimental-graph').append("svg").attr("width", width).attr("height", height);
var g = svg.append("g")

function drawGraph(currentData) {
    let x_values = d3.scaleLinear()
        .domain(d3.extent(currentData, d => d.x))
        .range([margin.left, width - margin.right])
    var y_domain = [Math.min(d3.min(currentData, d => d.y), 0), Math.max(1, d3.max(currentData, d => d.y))]
    let y_values = d3.scaleLinear()
        .domain(y_domain).nice()
        .range([height - margin.bottom, margin.top])
    var line = d3.line()
        .x(d => x_values(d.x))
        .y(d => y_values(d.y))
    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x_values)
            .ticks(width / 80)
            .tickSizeOuter(0))
    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y_values)
            .tickValues(d3.scaleLinear().domain(y_values.domain()).ticks()))

    g.append("g").call(xAxis);
    g.append("g").call(yAxis);

    svg.selectAll("path").data([currentData]).exit().remove();
    svg.append("path")
        .attr("class", "curve")
        .data([currentData])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
}

var scrubber_mu = document.getElementById("scrubber_mu");
scrubber_mu.min = 0
scrubber_mu.max = 5
scrubber_mu.value = 0
scrubber_mu.step = 0.5

var scrubberSd = document.getElementById("scrubber_sd");
scrubberSd.min = 0
scrubberSd.max = 2
scrubberSd.value = 0
scrubberSd.step = 0.1

var printMu = document.getElementById("current_mu");
printMu.innerHTML = scrubber_mu.value;

var printSd = document.getElementById("current_sd");
printSd.innerHTML = scrubber_sd.value;

var sd = 0.5
var x_max = 5
var x_step = 0.01
var x_range = d3.range(-x_max, x_max, x_step)
drawGraph(generateNormalData(x_range, scrubber_mu.value, sd))

scrubber_mu.oninput = function() {
    let scrubbedMu = parseFloat(this.value)
    printMu.innerHTML = scrubbedMu;
    var data = generateNormalData(x_range, this.value, sd)
    drawGraph(data)
}
