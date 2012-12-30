//BACKBONE app here
//
$(function(){

  window.Expense = Backbone.Model.extend({
    defaults: {
      "item": "pizza",
      "amount": "300"
    } //add a url at some point too
  });

  window.ExpenseCollection = Backbone.Collection.extend({
    model: Expense,
    sumExpenses: function(){
      var total = 0;
      this.each(function(model){
        total += parseInt(model.get('amount')); //need to be explicit here, or selse the string gets concatenated
      });
      return total;
    }
  });

  window.Expenses = new ExpenseCollection;



  window.ExpenseView = Backbone.View.extend({
    tagName: "li", //let's make this an li
    template: _.template($('#spend-template').html()),
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  window.GraphView = Backbone.View.extend({
    el: $("#viz"),
    // helper functions up top
    totalIncome: function(){
      return $('#income').val() * $('#frequency').val();
    },
    totalExpenses: function(){
      return $('#sum-expenses').val();
    },

    chartValues: function(){
      var avgAmt = avgAmt = Math.floor(this.totalIncome()/6);

      return [{ values: this.generateData(true, avgAmt), key: "cash", color: "#2ca02c"},
             { values: this.generateData(false, $('#sum-expenses').val()), area: true, key: "spending", color:"lightsalmon"}];
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
      data = this.chartValues();

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
    setText: function(){
      if((this.totalIncome() - this.totalExpenses()) > 0) 
        $('#savings').text(this.totalIncome() - this.totalExpenses()).css("color", "black");
      else
        $('#savings').text(this.totalIncome() - this.totalExpenses()).css("color", "red");
    },
    render: function(){
      nv.addGraph(this.chart());
      this.setText();
    }
  });

  window.AppView = Backbone.View.extend({
  el: $("#app"),
  collection: Expenses,
  events: {
    "change .trigger": "render",
    "click #add-expense" : "newExpense"
  }, //all we need is events right now
  initialize: function(){
    //wire up collections
    this.collection.bind('add', this.addOne, this);
    this.collection.bind('reset', this.addAll, this);

    this.render();
  },
  newExpense: function(e){
    e.preventDefault();
    var expense = new Expense;
    expense.set({item: $('#expense-name').val(), amount: $('#expense-amount').val()});
    this.collection.add(expense);
  },
  addOne: function(expense){
    var view = new ExpenseView({model: expense});
    var render = view.render().el;
    this.$('#spendlist').append(render);
    $(render).slideDown("slow");
    this.$('#sum-expenses').val(this.collection.sumExpenses());
    this.$('#sum-expenses').trigger('change'); //need to manuall trigger the change here
  },
  allAll: function (){
    this.$('#spendlist').empty();
    this.collection.each(this.addOne);
  },
  render: function(){
    var graph = new GraphView;
    graph.render();
    //actually, need to go through SpendList colleciton and call spendView render on each
    //var spendList = new ExpenseView;
    //spendList.render();

  }
  });

  window.app = new AppView;

});
