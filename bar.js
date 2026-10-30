function createBarChart(data) {

    const container = d3.select("#bar-chart");
    container.selectAll("*").remove();

    const width = 800;
    const height = 450;

    const margin = {
        top: 40,
        right: 30,
        bottom: 80,
        left: 85
    };

    // Create responsive SVG
    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

    // X-axis: Screen technology
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.screen_tech))
        .range([margin.left, width - margin.right])
        .padding(0.35);

    // Y-axis: Average energy consumption
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.energy)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Bar colours
    const colorScale = d3.scaleOrdinal()
        .domain(["LCD", "LED", "OLED"])
        .range(["#60a5fa", "#a78bfa", "#f472b6"]);

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
        .call(d3.axisBottom(xScale));

    // Y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Draw bars
    svg.selectAll(".energy-bar")
        .data(data)
        .join("rect")
        .attr("class", "energy-bar")
        .attr("x", d => xScale(d.screen_tech))
        .attr("y", d => yScale(d.energy))
        .attr("width", xScale.bandwidth())
        .attr("height", d =>
            height - margin.bottom - yScale(d.energy)
        )
        .attr("fill", d => colorScale(d.screen_tech))
        .attr("rx", 6)
        .append("title")
        .text(d =>
            `${d.screen_tech}: ${d.energy.toFixed(2)} kWh/year`
        );

    // Values above bars
    svg.selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d =>
            xScale(d.screen_tech) + xScale.bandwidth() / 2
        )
        .attr("y", d => yScale(d.energy) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .text(d => d.energy.toFixed(1));

    // X-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Screen Technology");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Average Energy Consumption (kWh/year)");
}