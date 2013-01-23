cash-traxxor
============

See the app [here](http://cash-traxxor.herokuapp.com/)
----------

This is a simple app I put together to play with [d3.js](http://d3js.org/), a JavaScript graphing library. Specifically, it uses the [nvd3](http://nvd3.org) wrapper to manipulate the graphs.

The backend of the app is built in Ruby using [Sinatra](http://www.sinatrarb.com/). I chose Sinatra since because of the ease of use in dealing with RESTful http requests. Eventually, I want to hook this app into a mongoDB database so it will save people's expense lists server-side. Right now, nothing is saved and when you refresh the page, you start out with a fresh app.

I also wanted to play around with [compass](http://compass-style.org) and [Sass/Scss](http://sass-lang.com/). I am also using [haml](http://haml.info/) to do the HTML templating.

Reading the source of public/js/app.js will walk you through how the app works (hopefully it is clear enough).

You can see the app in action on [Heroku](http://cash-traxxor.herokuapp.com/).


