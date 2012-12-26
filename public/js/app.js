//BACKBONE app here
//
$(function(){
  window.AppView = Backbone.View.extend({
    el: $("app"),
  events: {
    "click #income": "setIncome",
  "click #expenses": "setExpenses"
  }, //all we need is events right now
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



  window.CashModel = Backbone.Model.extend({
    defaults: {
      "income": "true",
      "amount": "100",
      "frequency": "4"//should be a number indicating how often it happens in a month
    },
    calculateFrequency: function(){
      //do something
    },
    generateData: function(){
      var now = new Date(),
          x,
          y,
          generatedData = [];

      var days = new Date(now.getYear(), now.getMonth()).getDate();
      var daysIncrement = Math.floor(days/this.frequency);

      for(var i = 1; i <= this.frequency; i++)
      {
        generatedData.push({x: new Date(now.getYear(), now.getMonth(), i * daysIncrement).getTime(), y: (i * this.amount)});
        //TODO: debug here

      }
      //based on this.amount, this.income, and this.frequency, this will generate the x/y data
      return generatedData;
    }
  });

  window.CashModels = Backbone.Collection.extend({
    model: CashModel //TODO: add url attrib
  });

  window.GraphView = Backbone.View.extend({
      el: $("#viz"),

      lostChart: function(){
          var lost = [4, 8, 15, 16, 23, 42], //LOST
              cash = [],
              spend = [],
              i,
              cashModel = new CashModel;
    for(i = 0; i < lost.length; i++) {
      spendDate = (new Date).getTime();
      spend.push({ x: spendDate, y: 30});
      var cashDate = new Date(2012,12,i).getTime();
      cash.push({ x: cashDate, y: lost[i]});
    }

    cashModel.amount = "342";
    cashModel.income = true;
    cashModel.frequency = "4";

    return [{ values: cashModel.generateData(), key: "cash", color: "#2ca02c"},
            { values: spend, area: true, key: "spending", color:"lightsalmon"}];

    },
    chart: function(){
      var chart = nv.models.lineChart(),
          data = this.lostChart(),
          minDate = "20111201",
          maxDate = "20121201";

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
