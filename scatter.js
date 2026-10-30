function createScatterPlot(data) {
    const container = d3.select("#scatter-chart");
    container.selectAll("*").remove();

    const width = 800;
    const height = 450;

    const margin = {
        top: 30,
        right: 30,
        bottom: 65,
        left: 85
    };

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.screensize)])
        .nice()
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy_consumpt)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // X axis
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    // Y axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Scatter points
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.screensize))
        .attr("cy", d => yScale(d.energy_consumpt))
        .attr("r", 3.5)
        .attr("fill", "#4682b4")
        .attr("opacity", 0.6)
        .append("title")
        .text(d =>
            `${d.brand.toUpperCase()}
Screen size: ${d.screensize} inches
Energy consumption: ${d.energy_consumpt}`
        );

    // X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .text("Screen Size (inches)");

    // Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Energy Consumption");
}