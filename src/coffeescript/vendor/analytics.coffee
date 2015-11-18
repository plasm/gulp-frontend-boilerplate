$ = require "jquery"

class Analytics
  defaults:
    UA: "UA-XXXXXX"

  send: () ->
    do ((b, o, i, l, e, r) ->
      b.GoogleAnalyticsObject = l
      b[l] or
      (b[l] = ->
        (b[l].q = b[l].q or []).push arguments
        return
      )
      b[l].l = +new Date
      e = o.createElement(i)
      r = o.getElementsByTagName(i)[0]
      e.src = '//www.google-analytics.com/analytics.js'
      r.parentNode.insertBefore e, r
      return
    ) window, document, 'script', 'ga'
    ga 'create', @options.UA
    ga 'send', 'pageview'

  # Constructor class
  constructor: (el, options) ->
    # Set options
    @options = $.extend({}, @defaults, options )
    do @send

module.exports = Analytics
