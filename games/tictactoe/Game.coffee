tictactoe={}
g4.module "tictactoe.Game"
g4.requires "g4.Game","g4.Item"
g4.defines ->

  class g4.Font
    internalContext=document.createElement("canvas").getContext("2d");
    constructor:->

    family:"Arial"
    size:128

    measureText : (text)->
      # draw the text
      internalContext.font = @
      console.log internalContext.font
      #internalContext.fillStyle = @color
      #internalContext.textBaseLine = @align
      dim = internalContext.measureText(text)
      dim.height = @size

      return dim

    toString:->
      "#{@size}px #{@family}"


  class tictactoe.Piece extends g4.Item
    font:null
    size:null
    text:"O"
    constructor:->
      @font=new g4.Font()
      @size= @font.measureText(@text)
    onUpdate:(delta)->
      @move(g4.Input.mouse.x,g4.Input.mouse.y)
    onDraw:(ctx)->
      #ctx.translate(@x,@y)
      ctx.font=@font

      ctx.fillRect(@x,@y,@size.width,@size.height)
      ctx.fillStyle="red"

      ctx.textBaseline="top"
      ctx.fillText(@text,@x,@y)
      #ctx.beginPath()
      #ctx.addSvgPath "M 116.96875 85.65625 L 103.875 98.78125 L 119.71875 114.59375 L 103.875 130.4375 L 116.96875 143.53125 L 132.8125 127.6875 L 148.65625 143.53125 L 161.75 130.4375 L 145.90625 114.59375 L 161.75 98.78125 L 148.65625 85.65625 L 132.8125 101.5 L 116.96875 85.65625 z "
      #ctx.addSvgPath "m 13.089847,0 -13.09375037,13.125019 15.84375037,15.8125 -15.84375037,15.8437 13.09375037,13.0938 15.84375,-15.8438 15.84375,15.8438 13.09375,-13.0938 -15.84375,-15.8437 15.84375,-15.8125 L 44.777347,0 28.933597,15.843719 z"
      #ctx.fill()
      #ctx.fillRect(this.x,this.y,10,10);

  class tictactoe.Game extends g4.Game
    constructor:(canvas)->
      super canvas
      cursor=new tictactoe.Piece()



      this.scene.add cursor

