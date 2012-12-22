require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json'
require 'haml'
require 'sass'
require 'compass'

configure do
  Compass.configuration do |config|
    config.project_path = File.dirname(__FILE__)
    config.sass_dir = File.join "views", "stylesheets"
  end

  set :haml, { :format => :html5 }
  set :sass, Compass.sass_engine_options
  set :scss, Compass.sass_engine_options
end

helpers do
  def partial(page, options={})
    haml page, options.merge!(:layout => false)
  end
end


get '/stylesheets/:name.css' do
  content_type 'text/css', :charset => 'utf8'
  #sass (:"stylesheets/#{params[:name]}")
  scss (:"stylesheets/#{params[:name]}")
end


#DB = Mongo::Connection.new.db("case", :pool_size => 5, :timeout => 5)

get '/' do
  haml :index, :attr_wrapper => '"', :locals => {:title => 'Cash Traxxor'}
end

before '/api/*' do
  content_type :json
end

=begin
get '/api/:thing' do
  DB.collection(params[:thing]).find.to_a.map{|t| from_bson_id(t)}.to_json
end

get '/api/:thing/:id' do
  from_bson_id(DB.collection(params[:thing]).find_one(to_bson_id(params[:id]))).to_json
end

post '/api/:thing' do
  oid = DB.collection(params[:thing]).insert(JSON.parse(request.body.read.to_s))
  "{\"_id\": \"#{oid.to_s}\"}"
end

delete '/api/:thing/:id' do
  DB.collection(params[:thing]).remove('_id' => to_bson_id(params[:id]))
end

put '/api/:thing/:id' do
  DB.collection(params[:thing]).update({'_id' => to_bson_id(params[:id])}, {'$set' => JSON.parse(request.body.read.to_s).reject{|k,v| k == '_id'}})
end

def to_bson_id(id) BSON::ObjectId.from_string(id) end
def from_bson_id(obj) obj.merge({'_id' => obj['_id'].to_s}) end
=end
