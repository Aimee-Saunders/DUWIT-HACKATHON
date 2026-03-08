
// Making margins for axes and titles outisde the SVG elements
const width = 900;
const height = 320;

let margin = {top: 40, right: 30, bottom: 40, left: 70};

let svg = d3.select("#chart");

// Calculating width of actual element from margins
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip allows the heat map interactive to become interactive
const tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",0);


  // Making the bar chart that shows the top 10 hour slots by productivity
  function showTop10(top10) {
  // Sorting out more margins
  const container = d3.select("#tools");
  container.html("");

  const width = 500;
  const height = 350;
  const margin = { top: 20, right: 40, bottom: 40, left: 140 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Making day-of-week labels for the y-axis by finding the day and hour from corresponding numbers
  const label = d => {
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    return `${days[d.day]} ${String(d.hour).padStart(2,"0")}:00`;
  };

  // Making x-axis based on the average productivity rating value
  const x = d3.scaleLinear()
      .domain([0, d3.max(top10, d => d.avg)])
      .range([0, innerWidth]);

  // Making y-axis of top 10 times
  const y = d3.scaleBand()
      .domain(top10.map(label))
      .range([0, innerHeight])
      .padding(0.2);

  // Adding each bar
  g.selectAll("rect")
      .data(top10)
      .enter()
      .append("rect")
      .attr("y", d => y(label(d)))
      .attr("width", d => x(d.avg))
      .attr("height", y.bandwidth())
      .attr("fill", "#e24aa3");

  // Adding number to the end of the bar
  g.selectAll("text.value")
      .data(top10)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", d => x(d.avg) + 5)
      .attr("y", d => y(label(d)) + y.bandwidth() / 2 + 4)
      .text(d => d.avg.toFixed(2));

  // Moves down for next bar
  g.append("g")
    .style("font-family", "Georgia")
    .call(d3.axisLeft(y));

  g.append("g")
    .style("font-family", "Georgia")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x));

  // Adding title of chart
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Georgia")
      .text("Highest Productivity Hours");
}

// Parsing CSV file
d3.csv("productivity.csv", d => {

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

        // Using the tooltip to make the heatmap interactive
        // Written with GenAI 
        .on("mouseover", (event, d) => {

    // Adding the average number inside the cell
    g.append("text")
        .attr("class", "hover-label")
        .attr("x", x(d.hour) + x.bandwidth() / 2)
        .attr("y", y(d.day) + y.bandwidth() / 2 + 4)
        .attr("text-anchor", "middle")
        .text(d.avg.toFixed(2));
        })

        .on("mousemove", (event, d) => {
            const [mouseX, mouseY] = d3.pointer(event, svg.node());
            tooltip
                .style("left", (mouseX + margin.left + 10) + "px")
                .style("top", (mouseY + margin.top - 25) + "px");
        })

        // Removing the average showing when mouse leaves the cell
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
            d3.selectAll(".hover-label").remove();
        })

        // When a cell is clicked on, its specific bar chart showing distribution of productivity 
        .on("click", (event, d) => {
          showDistribution(d);
        });

      svg.append("text")
      .attr("x", width / 2)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Georgia")
      .text("Your average productivity reported for each hour");

    // Layout for x-axis
    const xAxis = d3.axisBottom(x)
      .tickFormat(d => `${String(d).padStart(2, "0")}:00`);

    // Moving time labels to the start of each cell
    const xAxisG = g.append("g")
    .style("font-family", "Georgia")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis);

    xAxisG.selectAll(".tick")
    .attr("transform", d => `translate(${x(d)},0)`)

    xAxisG.selectAll(".tick text")
        .attr("text-anchor", "start")
        .attr("dx", "-1.35em");

    // Labels for y-axis
    const yAxis = d3.axisLeft(y)
      .tickFormat(d => ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][d]);

    g.append("g")
      .style("font-family", "Georgia")
      .call(yAxis);


  // Best hours functionality
  // Sorts the average productivity values and selects the top ten
  const top10 = [...data]
    .sort((a, b) => d3.descending(a.avg, b.avg))
    .slice(0, 10);

  showTop10(top10);
}
);

function showDistribution(d) {

  const container = d3.select("#distribution");
  container.html("");

  // Sorting margins
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

  // Sets the bar colour based on 'level' of productivity
  const barColor = d3.scaleSequential()
    .domain([1, 5])
    .interpolator(d3.interpolateRgbBasis(["#d73027", "#ffde21", "#1a9850"]));

  // Adding all of the bars
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

  // Moves along for next bar
  g.append("g")
    .style("font-family", "Georgia")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .style("font-family", "Georgia")
    .call(d3.axisLeft(y).ticks(d3.max(d.freq)));

  // Bar chart title text
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 1.5 - 5)
    .attr("text-anchor", "middle")
    .style("font-family", "georgia")
    .style("font-size", "12px")
    .text(`Productivity Levels (Day ${d.day}, Hour ${d.hour})`);

}






