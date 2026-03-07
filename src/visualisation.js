const width = 900;
const height = 300;

const margin = {top: 30, right: 20, bottom: 30, left: 60};

const svg = d3.select("#chart");

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


const tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    .style("opacity",0);


// Parsing CSV file
d3.csv("../data/productivity.csv", d => {

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
        .interpolator(d3.interpolateLab("#f26c64", "#ffdd71", "#9fcd99"));

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
        .attr("fill", d => color(d.avg))
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseover",(event,d)=>{

            tooltip
            .style("opacity",1)
            .html(`
            Day: ${d.day}<br>
            Hour: ${d.hour}<br>
            Avg: ${d.avg.toFixed(2)}
            `);
            })

        .on("mousemove",(event)=>{

            tooltip
            .style("left",(event.pageX+10)+"px")
            .style("top",(event.pageY+10)+"px");

        })

        .on("mouseout",()=>{

            tooltip.style("opacity",0);

        })

        .on("click",(event,d)=>{

            showDistribution(d);

        });

    const xAxis = d3.axisBottom(x)
        .tickValues([0,4,8,12,16,20,23]);

    const yAxis = d3.axisLeft(y)
        .tickFormat(d => ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][d]);

    g.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    g.append("g")
        .call(yAxis);

    createLegend(color);

function showDistribution(d){

const container = d3.select("#distribution");

container.html("");

const width = 400;
const height = 200;

const svg = container
.append("svg")
.attr("width",width)
.attr("height",height);

const x = d3.scaleBand()
.domain([1,2,3,4,5])
.range([40,width-20])
.padding(0.2);

const y = d3.scaleLinear()
.domain([0,d3.max(d.freq)])
.range([height-30,10]);

svg.selectAll("rect")
.data(d.freq)
.enter()
.append("rect")
.attr("x",(v,i)=>x(i+1))
.attr("y",v=>y(v))
.attr("width",x.bandwidth())
.attr("height",v=>height-30-y(v))
.attr("fill","#4682b4");

svg.append("g")
.attr("transform",`translate(0,${height-30})`)
.call(d3.axisBottom(x));

const maxY = d3.max(d.freq);

svg.append("g")
  .attr("transform","translate(40,0)")
  .call(
    d3.axisLeft(y)
      .tickValues(d3.range(0, maxY + 1)) 
  );


svg.append("text")
.attr("x",width/2)
.attr("y",height)
.attr("text-anchor","middle")
.text(`Distribution (Day ${d.day}, Hour ${d.hour})`);

}
});

