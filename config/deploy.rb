require "yaml"

require 'bundler/capistrano'
require 'new_relic/recipes'
require 'delayed/recipes'

ssh_options[:forward_agent] = true
default_run_options[:pty] = true # Needed when not using public key authentication

set :application, "bookthatapp"
# set :port, 27027
# set :repository, "ssh://git@#{location}:#{port}/home/git/#{application}"
set :repository, "ssh://git@github.com:22/ShopifyConcierge/#{application}.git"

set :scm, :git
set :git_shallow_clone, 1
set :git_enable_submodules, false
set :deploy_via, :remote_cache
set :deploy_to, "/home/#{application}/app"
set :user, "shopifywidgets"
set :use_sudo, false
set :shared_children, shared_children + %w(public config private)
set :db_config_path, "#{shared_path}/config/database.yml"
set :shared_public_path, "#{shared_path}/public"
set :shared_private_path, "#{shared_path}/private"
set :rails_env, "production"
set :keep_releases, 5

set :location, "67.23.30.163"
role :app, location
role :web, location
role :db,  location, :primary => true

task :notify_rollbar, :roles => :app do
  set :revision, `git log -n 1 --pretty=format:"%H"`
  set :local_user, `whoami`
  set :rollbar_token, '9992a8d893df488f8a3106a3365e575a'
  rails_env = fetch(:rails_env, 'production')
  run "curl https://api.rollbar.com/api/1/deploy/ -F access_token=#{rollbar_token} -F environment=#{rails_env} -F revision=#{revision} -F local_username=#{local_user} >/dev/null 2>&1", :once => true
end

namespace :deploy do
  [:start, :stop].each do |t|
    desc "#{t} task is a no-op with mod_rails"
    task t, :roles => :app do ; end
  end

  # Deploy
  task :additional_symlinks, :except => { :no_release => true } do
    run "ln -nfs #{db_config_path} #{latest_release}/config/database.yml"
    run "ln -nfs #{shared_public_path} #{latest_release}/public/shared"
    run "ln -nfs #{shared_private_path} #{latest_release}/shared_private"
  end

  after "deploy:update_code", "deploy:additional_symlinks"
  after "deploy:update_code", "deploy:migrate", "deploy:cleanup"
  after "deploy:update_code", "newrelic:notice_deployment"
  after "deploy:restart", "delayed_job:restart"
  after :deploy, 'notify_rollbar'

  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

require './config/boot'
