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

graph.append("svg:path").attr("d", line(data));

