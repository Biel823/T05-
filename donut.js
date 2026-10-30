function createDonutChart(data) {

    const container = d3.select("#donut-chart");
    container.selectAll("*").remove();

    // Group TV counts by screen technology
    const totals = d3.rollups(
        data,
        rows => d3.sum(rows, d => d.count),
        d => d.screen_tech
    )
    .filter(d => d[0] && d[1] > 0)
    .map(d => ({
        technology: d[0],
        count: d[1]
    }));

    const width = 800;
    const height = 450;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto");

    const radius = 170;

    const chart = svg.append("g")
        .attr("transform", "translate(320,225)");

    const color = d3.scaleOrdinal()
        .domain(["LCD", "LED", "OLED"])
        .range(["#60a5fa", "#a78bfa", "#f472b6"]);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(95)
        .outerRadius(radius);

    // Draw donut slices
    chart.selectAll(".donut-slice")
        .data(pie(totals))
        .join("path")
        .attr("class", "donut-slice")
        .attr("d", arc)
        .attr("fill", d => color(d.data.technology))
        .attr("stroke", "white")
        .attr("stroke-width", 3)
        .append("title")
        .text(d => {
            const total = d3.sum(totals, x => x.count);
            const percent = d.data.count / total * 100;

            return `${d.data.technology}: ${d.data.count} TVs (${percent.toFixed(1)}%)`;
        });

    // Total TV count in centre
    const totalTVs = d3.sum(totals, d => d.count);

    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -5)
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .text(totalTVs.toLocaleString());

    chart.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 22)
        .style("font-size", "15px")
        .style("fill", "#666")
        .text("Total TVs");

    // Legend
    const legend = svg.append("g")
        .attr("transform", "translate(560,145)");

    const legendItems = legend.selectAll(".legend-item")
        .data(totals)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) =>
            `translate(0, ${i * 50})`
        );

    legendItems.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("rx", 4)
        .attr("fill", d => color(d.technology));

    legendItems.append("text")
        .attr("x", 30)
        .attr("y", 14)
        .style("font-size", "16px")
        .text(d => d.technology);

    legendItems.append("text")
        .attr("x", 30)
        .attr("y", 33)
        .style("font-size", "13px")
        .style("fill", "#666")
        .text(d => {
            const percent = d.count / totalTVs * 100;
            return `${percent.toFixed(1)}%`;
        });
}