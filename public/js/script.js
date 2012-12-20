var m = [80, 80, 80, 80]; //margins
var width = 1000 - m[1] - m[3];
var height = 400 - m[0] - m[2];

var data = [4, 8, 15, 16, 23, 42]; //LOST

var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
var y = d3.scale.linear().domain([0, 45]).range([height, 0]);


var line = d3.svg.line()
  .x(function(d,i){
    return x(i);
  })
  .y(function(d){
    return y(d);
  });

//this is a demo of how to do non-block area plots
var spend = d3.svg.area()
  .interpolate("linear")
  .x(function(d,i){
    return x(i);
  })
  .y1(function(d){
    return y(x);
  })
  .y0(function(d){
    return this.height; //sweet, access to this
  });

//now we overwrite the demo
var spend = d3.svg.area()
  .interpolate("linear")
  .x(function(d,i){
    return x(i);
  })
  .y1(function(d){
    return y(15);
  })
  .y0(function(d){
    return this.height;
  });

//setting up the tolltip

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolite")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("hello");

var graph = d3.select('#viz')
    .append("svg:svg")
    .attr("width", width + m[1] + m[3])
    .attr("height", height + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);

graph.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

graph.append("svg:g").attr("class", "y axis").attr("transform", "translate(-25, 0)").call(yAxisLeft);

//ok, apparently there's nothing called svg:area
graph.append("svg:path").attr("class", "spend").attr("d", spend(data));
//have this guy be last
graph.append("svg:path").attr("class", "line").attr("d", line(data));

//now for the tooltip
d3.select("#viz").append("svg:circle").attr("stroke", "black").attr("fill", "aliceblue").attr("r", 50).attr("cx", 52).attr("cy", 52)
  .on("mouseover", function(){return console.log("visibility", "visible");})
  .on("mousemove", function(){return tooltip.style("top", (event.pageY) + "px").style("left", (event.pageX) + "px");})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

