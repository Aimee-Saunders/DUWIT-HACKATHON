const width = 900;
const height = 300;

const margin = {top: 30, right: 20, bottom: 30, left: 60};

const svg = d3.select("#chart");

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("../data/productivity.csv", d => {

    const freq = d.frequencies.split("|").map(Number);
    const total = d3.sum(freq);

    const avg = total === 0 ? 0 :
        (freq[0]*1 + freq[1]*2 + freq[2]*3 + freq[3]*4 + freq[4]*5) / total;

    return {
        day: +d.day,
        hour: +d.hour,
        avg: avg
    };

}).then(data => {

    const x = d3.scaleBand()
        .domain(d3.range(24))
        .range([0, chartWidth]);

    const y = d3.scaleBand()
        .domain(d3.range(7))
        .range([0, chartHeight]);

    const color = d3.scaleSequential()
        .domain([1,5])
        .interpolator(d3.interpolateYlGnBu);

    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","cell")
        .attr("x", d => x(d.hour))
        .attr("y", d => y(d.day))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.avg));

    const xAxis = d3.axisBottom(x)
        .tickValues([0,4,8,12,16,20,23]);

    const yAxis = d3.axisLeft(y)
        .tickFormat(d => ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][d]);

    g.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    g.append("g")
        .call(yAxis);

});