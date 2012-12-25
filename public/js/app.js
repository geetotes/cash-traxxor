//BACKBONE app here
//
$(function(){
window.AppView = Backbone.View.extend({
  el: $("app"),
  events: {
    "click #income": "setIncome",
    "click #expenses": "setExpenses"
  }, //we need is events right now
  initialize: function(){
    var graph = new GraphView;
    graph.render();
  },
  setIncome: function(){
    //???
  },
  setExpenses: function(){
    //????
  }
});

window.GraphView = Backbone.View.extend({
  el: $("#viz"),
  lostChart: function() {
        var lost = [4, 8, 15, 16, 23, 42]; //LOST
          var cash = [],
        spend = [];
  for(var i = 0; i < lost.length; i++){
        spend.push({ x: i, y: 30});
            cash.push({ x: i, y: lost[i]});
              }
    return [{ values: cash, key: "cash", color: "#2ca02c"},
            { values: spend, area: true, key: "spending", color:"lightsalmon"}];


    },
  chart: function(){
      var chart = nv.models.lineChart(),
          data = this.lostChart();

      chart.x(function(d,i){return i});

      chart.xAxis
        .axisLabel('Time')
        .tickFormat(d3.format('.01f'));

      chart.yAxis
        .axisLabel('Money')
        .tickFormat(d3.format('.02f'));

      d3.select("#viz svg")
        .datum(data)
        .transition().duration(500)
        .call(chart);

      nv.utils.windowResize(function() { d3.select("#viz svg").call(chart)});

      return chart;
  },

  render: function(){
    nv.addGraph(this.chart());
  }
});

window.app = new AppView;

});
