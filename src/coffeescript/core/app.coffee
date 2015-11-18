$ = require "jquery"

class App
  defaults:
    # Imposta il prefisso delle classi css
    # Se definisco una classe js_main in frontend priva di stili
    # effettuo una chiamata al method interno "main"
    prefix: "js_"
    onInit: () ->

  ###
   Public Methods
  ###

  main: ->
    $("body").addClass("loaded")

  # Initialize
  _initialize: ->
    # Section
    section = @el.attr('class')?.split(' ')
    # Call method on class base
    $(section).each (index, classe) =>
      if classe.indexOf(@options.prefix) == 0
        classe = classe.substring(@options.prefix.length)
        @[classe]?.call?(@)

  # Microtemplate
  _t:(s,d) ->
    for p of d
      s = s.replace(new RegExp("{#{p}}","g"), d[p])
    s

  #
  # Constructor class
  constructor: (el, options) ->
    # Set options
    @options = $.extend({}, @defaults, options )
    @el = $(el)
    do @_initialize
    @

module.exports = App
