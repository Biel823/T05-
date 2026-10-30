function createLineChart(data) {

    const container = d3.select("#line-chart");
    container.selectAll("*").remove();

    const width = 800;
    const height = 450;

    const margin = {
        top: 30,
        right: 30,
        bottom: 65,
        left: 85
    };

    // Create responsive SVG
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

    // X-axis: Year
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, width - margin.right]);

    // Y-axis: Average electricity price
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Horizontal gridlines
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(
            d3.axisLeft(yScale)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#e5e7eb");

    // X-axis
    svg.append("g")
        .attr("transform",
              `translate(0, ${height - margin.bottom})`)
        .call(
            d3.axisBottom(xScale)
                .tickFormat(d3.format("d"))
                .ticks(7)
        );

    // Y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.price));

    // Draw line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#d16aa4")
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    // Add circles for each year
    svg.selectAll(".price-point")
        .data(data)
        .join("circle")
        .attr("class", "price-point")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.price))
        .attr("r", 4)
        .attr("fill", "#d16aa4")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .append("title")
        .text(d =>
            `Year: ${d.year}\nAverage Price: $${d.price} AUD/MWh`
        );

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Year");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Average Price (AUD/MWh)");
}