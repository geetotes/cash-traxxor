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


  window.CashModel = Backbone.Model.extend({
    defaults: {
      "income": "true",
    "amount": "100",
    "frequency": "6"//should be a number indicating how often it happens in a month
    },
    calculateFrequency: function(){
      //do something
    },
    generateData: function(){
      var now = new Date(),
    x,
    y,
    generatedData = [];

  var currMonth = now.getMonth() + 1; //months 0 indexed
  var days = new Date(now.getFullYear(), currMonth, 0).getDate();
  var daysIncrement = Math.floor(days/this.frequency);

  for(var i = 1; i <= this.frequency; i++)
  {
    //check to see if this is an expense or income
    if(this.income)
      generatedData.push({x: new Date(now.getFullYear(), now.getMonth(), i * daysIncrement).getTime(), y: (i * this.amount)});
    else
      generatedData.push({x: new Date(now.getFullYear(), now.getMonth(), i * daysIncrement).getTime(), y: (this.amount)});
    console.log('x: '+new Date(now.getFullYear(), now.getMonth(), i * daysIncrement).getTime());
    console.log('i: '+i*daysIncrement);
    console.log('days increment'+daysIncrement);
    console.log('year: '+now.getFullYear()+'month: ',now.getMonth());

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
    cashModel = new CashModel,
    expenseModel = new CashModel;
    for(i = 0; i < lost.length; i++) {
      spendDate = (new Date).getTime();
      spend.push({ x: spendDate, y: 30});
      var cashDate = new Date(2012,12,i).getTime();
      cash.push({ x: cashDate, y: lost[i]});
    }


    //crunch numbers for proper amount here:
    var totalAmount = $('#income').val() * $('#frequency').val();
    var avgAmt = Math.floor(($('#income').val() * $('#frequency').val())/6);

  cashModel.amount = avgAmt;
  cashModel.income = true;
  cashModel.frequency = "6";//frequency needs to be at least 6 in order to avoid NaN dates in timeline

  expenseModel.amount = $('#expenses').val();
  expenseModel.income = false;
  expenseModel.frequency = "6";//expense frequency has to match income frequency

  $('#savings').text(totalAmount - $('#expenses').val());

  return [{ values: cashModel.generateData(), key: "cash", color: "#2ca02c"},
         { values: expenseModel.generateData(), area: true, key: "spending", color:"lightsalmon"}];

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
