g4.module "g4.Game"
g4.requires "g4.Scene","g4.Item","g4.Input"
g4.defines ->
  console.log $arg "module: g4.Game using %c",g4.Scene
  class g4.Game
    paused:false,
    canvas:null,
    backBufferCanvas:null,
    canvasWidth:0,
    canvasHeight:0,
    startTime:0,
    fps:0,
    scene:null,
    constructor:(@canvas)->
      if (e=g4.Type.check "g4.Game#",arguments,g4.Canvas) then throw e
      @canvasWidth=canvas.element.width;
      @canvasHeight=canvas.element.height;
      @backBufferCanvas=new g4.Canvas(@canvasWidth, @canvasHeight);
      @startTime=window.animationStartTime;
      #@fps=0;
      @scene=new g4.Scene(this);
      g4.Input.register(@canvas.element);
      window.requestAnimationFrame(@_update);

    _update:(time)=>
      delta=time-@startTime;
      @fps=1000/delta;
      if (!@paused)
          window.requestAnimationFrame(@_update);
      @update(delta);

      @startTime=time;

      @backBufferCanvas.ctx.clearRect(0,0,@canvas.element.width, @canvas.element.height);
      @draw(@backBufferCanvas.ctx);
      @canvas.ctx.clearRect(0,0,@canvas.element.width, @canvas.element.height);
      @canvas.ctx.drawImage(@backBufferCanvas.ctx.canvas,0,0);
      g4.Input.update(delta);
      return

    update:(delta)->
      @scene.update(delta);
      return

    draw:(ctx)->
      @scene.draw(ctx);
      return
