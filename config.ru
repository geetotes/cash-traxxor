log = File.new('log/sinatra.log', 'a')
$stdout.reopen(log)
$stderr.reopen(log)

require './app.rb'
run Sinatra::Application
