g4.module "g4.Scene"
g4.requires "g4.Item","g4.Game"
g4.defines ->
  class g4.Scene
    items:[],
    game:null,
    constructor:(@game)->
      if (e=g4.Type.check "g4.Scene#init",arguments,g4.Game) then throw e
    add:(item,x,y)->
      if (e=g4.Type.check "g4.Scene#add",arguments,g4.Item) then throw e
      item.move(x,y) if arguments.length>1
      item.scene=this
      item.game=@game
      @items.push(item)
      item.onCreate()
      return
    update:(delta)->
      for item in @items
        item.onUpdate(delta)
      return
    draw:(ctx)->
      for item in @items
        ctx.save()
        item.onDraw(ctx)
        ctx.restore()
      return