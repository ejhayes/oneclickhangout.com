require "bundler/capistrano"
require 'capistrano/s3'

set :access_key_id, ENV['SAGH_AWS_KEY']
set :secret_access_key, ENV['SAGH_AWS_SECRET']