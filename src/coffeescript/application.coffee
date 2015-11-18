# Plugin for Methods in console
require "./core/plugin.coffee"
$ = require "jquery" # jQuery
App = require "./core/app.coffee" # Application
Analytics = require "./vendor/analytics.coffee" # Analytics

# --------------------------------
# Analytics
# new Analytics
#   UA: "UA-XXXXXX"

$ ->
  # Init Application
  Application = new App "body"

