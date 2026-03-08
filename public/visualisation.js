const width = 900;
const height = 320;

let margin = {top: 40, right: 30, bottom: 40, left: 70};

let svg = d3.select("#chart");

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",0);


// Parsing CSV file
<<<<<<< HEAD:src/visualisation.js
d3.csv("../server/productivity.csv", d => {
=======
d3.csv("productivity.csv", d => {
>>>>>>> 8b7c20530edee5292d895ee1533919239f13c72f:public/visualisation.js

    const freq = d.frequencies.split("|").map(Number);
    const total = d3.sum(freq);

    // Finding average frequency
    const avg = total === 0 ? 0 :
        (freq[0]*1 + freq[1]*2 + freq[2]*3 + freq[3]*4 + freq[4]*5) / total;

    return {
        day: +d.day,
        hour: +d.hour,
        avg: avg,
        freq: freq 
    };

}).then(data => {

  // Creating hour scale
    const x = d3.scaleBand()
        .domain(d3.range(24))
        .range([0, chartWidth])
        .paddingInner(0.05);

  // Creating weekday scale
    const y = d3.scaleBand()
        .domain(d3.range(7))
        .range([0, chartHeight])
        .paddingInner(0.05);

    // Makes colour gradient based on average productivity score for the hour
    const color = d3.scaleSequential()
        .domain([1,5])
        .interpolator(d3.interpolateRgbBasis(["#d32a21", "#ffc61b", "rgb(39, 172, 13)" ]));

    // Drawing, positioning, and colouring heatmap cells 
    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","cell")
        .attr("x", d => x(d.hour))
        .attr("y", d => y(d.day))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => d.avg === 0 ? "#ffffff" : color(d.avg))
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseover", (event, d) => {

    // Add the average number inside the cell
    g.append("text")
        .attr("class", "hover-label")
        .attr("x", x(d.hour) + x.bandwidth() / 2)
        .attr("y", y(d.day) + y.bandwidth() / 2 + 4)
        .attr("text-anchor", "middle")
        .text(d.avg.toFixed(2));
        })

        .on("mousemove", (event, d) => {
            // Position tooltip above the cell
            const [mouseX, mouseY] = d3.pointer(event, svg.node());

            tooltip
                .style("left", (mouseX + margin.left + 10) + "px")
                .style("top", (mouseY + margin.top - 25) + "px");
        })

        .on("mouseout", () => {
            // Hide tooltip
            tooltip.style("opacity", 0);

            // Remove the in‑cell label
            d3.selectAll(".hover-label").remove();
        })

        .on("click", (event, d) => {
          showDistribution(d);
        });

    const xAxis = d3.axisBottom(x)
      .tickFormat(d => `${String(d).padStart(2, "0")}:00`);

    const yAxis = d3.axisLeft(y)
        .tickFormat(d => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][d]);

    g.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    g.append("g")
        .call(yAxis);

    createLegend(color);


  // Best hours functionality

  const top10 = [...data]
    .sort((a, b) => d3.descending(a.avg, b.avg))
    .slice(0, 10);

  showTop10(top10);
  

}
);

function showDistribution(d) {

  const container = d3.select("#distribution");
  container.html("");

  const width = 400;
  const height = 220;

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleBand()
    .domain([1, 2, 3, 4, 5])
    .range([0, innerWidth])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(d.freq)])
    .range([innerHeight, 0]);

  const barColor = d3.scaleSequential()
    .domain([1, 5])
    .interpolator(d3.interpolateRgbBasis(["#d73027", "#ffde21", "#1a9850"]));

  g.selectAll("rect")
    .data(d.freq)
    .enter()
    .append("rect")
    .attr("x", (v, i) => x(i + 1))
    .attr("y", v => y(v))
    .attr("width", x.bandwidth())
    .attr("height", v => innerHeight - y(v))
    .attr("fill", (v, i) => barColor(i + 1))
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5);

  g.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y).ticks(d3.max(d.freq)));


  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 1.5 - 5)
    .attr("text-anchor", "middle")
    .style("font-family", "georgia")
    .style("font-size", "12px")
    .text(`Productivity Levels (Day ${d.day}, Hour ${d.hour})`);

}

function showTop10(top10) {

  const container = d3.select("#tool");
  container.html("");

  const width = 500;
  const height = 350;
  const margin = { top: 20, right: 20, bottom: 40, left: 140 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Format label: "Tuesday 14:00"
  const label = d => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return `${days[d.day]} ${String(d.hour).padStart(2,"0")}:00`;
  };

  // Scales
  const x = d3.scaleLinear()
      .domain([0, d3.max(top10, d => d.avg)])
      .range([0, innerWidth]);

  const y = d3.scaleBand()
      .domain(top10.map(label))
      .range([0, innerHeight])
      .padding(0.2);

  // Bars
  g.selectAll("rect")
      .data(top10)
      .enter()
      .append("rect")
      .attr("y", d => y(label(d)))
      .attr("width", d => x(d.avg))
      .attr("height", y.bandwidth())
      .attr("fill", "#4a90e2");

  // Value labels
  g.selectAll("text.value")
      .data(top10)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", d => x(d.avg) + 5)
      .attr("y", d => y(label(d)) + y.bandwidth() / 2 + 4)
      .text(d => d.avg.toFixed(2));

  // Y-axis
  g.append("g")
      .call(d3.axisLeft(y));

  // X-axis
  g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x));

  // Title
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Georgia")
      .text("Top 10 Most Productive Day–Hour Slots");
}





