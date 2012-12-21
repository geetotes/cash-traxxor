d3.helper = {};
d3.helper.tooltip = function(accessor){
  return function(selection){
    var tooltipDiv;
    var bodyNode = d3.select("body").node();
    selection.on("mouseover", function(d, i){
      //clean up
      d3.select("body").selectAll("div.tooltip").remove();
      tooltipDiv = d3.select("body").append("div").attr("class", "tooltip");
      var absoluteMousePos = d3.mouse(bodyNode);
      tooltipDiv.style("left", (absoluteMousePos[0] + 10) + "px")
        .style("top", (absoluteMousePos[1] - 15) + "px")
        .style("position", "absolute")
        .style("z-index", 1001);
      var tooltipText = accessor(d, i) || "";
      tooltipDiv.style("width", function(d, i){return (tooltipText.length > 80) ? "300px" : null;})
      .html(tooltipText);
    })
    .on("mousemove", function(d, i){
      //move tooltip
      var absoluteMousePos = d3.mouse(bodyNode);
      tooltipDiv.style("left", (absoluteMousePos[0] + 10) + "px")
        .style("top", (absoluteMousePos[1] - 15) + "px");
      var tooltipText = accessor(d, i) || "";
      tooltipDiv.html(tooltipText);
    })
    .on("mouseout", function(d, i){
      //remove it
      tooltipDiv.remove();
    });
  }
};
