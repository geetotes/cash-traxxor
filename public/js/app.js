//BACKBONE app here
//
$(function(){
  window.AppView = Backbone.View.extend({
    el: $("#app"),
  events: {
    "blur .trigger": "redraw",
  "click .trigger": "redraw"
  }, //all we need is events right now
  initialize: function(){
    var graph = new GraphView;
    graph.render();
  },
  redraw: function(){
    var graph = new GraphView;
    graph.render();

  },
  setExpenses: function(){
    //????
  }
  });

  window.GraphView = Backbone.View.extend({
    el: $("#viz"),

    lostChart: function(){
      var lost = [4, 8, 15, 16, 23, 42], //LOST
      cash = [],
      spend = [],
      i;

      for(i = 0; i < lost.length; i++) {
        spendDate = (new Date).getTime();
        spend.push({ x: spendDate, y: 30});
        var cashDate = new Date(2012,12,i).getTime();
        cash.push({ x: cashDate, y: lost[i]});
      }

      //crunch numbers for proper amount here:
      var totalAmount = $('#income').val() * $('#frequency').val();
      var avgAmt = Math.floor(($('#income').val() * $('#frequency').val())/6);
      $('#savings').text(totalAmount - $('#expenses').val());

      return [{ values: this.generateData(true, avgAmt), key: "cash", color: "#2ca02c"},
             { values: this.generateData(false, $('#expenses').val()), area: true, key: "spending", color:"lightsalmon"}];

    },
    generateData: function(income, amount){
      var now = new Date(),
        x,
        y,
        generatedData = [],
        frequency = 6,
        currMonth = now.getMonth() + 1, //months 0 indexed
        days = new Date(now.getFullYear(), currMonth, 0).getDate(),
        daysIncrement = Math.floor(days/frequency);

      for(var i = 1; i <= frequency; i++)
      {
        //check to see if this is an expense or income
        if(income)
          generatedData.push({x: new Date(now.getFullYear(), now.getMonth(), i * daysIncrement).getTime(), y: (i * amount)});
        else
          generatedData.push({x: new Date(now.getFullYear(), now.getMonth(), i * daysIncrement).getTime(), y: (amount)});
      }
      //based on this.amount, this.income, and frequency, this will generate the x/y data
      return generatedData;


    },
    chart: function(){
      var chart = nv.models.lineChart(),
      data = this.lostChart();

      chart.x(function(d,i){return i});

      chart.xAxis
        .axisLabel('Time')
        .tickFormat(function(d){
          var dx = data[0].values[d] && data[0].values[d].x || 0;
          return d3.time.format('%x')(new Date(dx))
        });


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
