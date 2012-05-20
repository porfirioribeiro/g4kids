#g4.module
#  name: "g4.Item"
#  defines: ->


g4.module "g4.Item"

g4.defines ->
  class g4.Item
    scene    : null,
    game     : null,
    x        : 0,
    y        : 0,
    move     : (@x, @y) ->
    onCreate : ()->
    onDestroy: ()->
    onUpdate : (delta)->
    onDraw   : (ctx)->
