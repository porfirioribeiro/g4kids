
if (!window.requestAnimationFrame)
    window.requestAnimationFrame=
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              (callback)->
                window.setTimeout(()->
                    callback(Date.now());
                , 1000 / 60);

#mozAnimationStartTime

Object.defineProperty window, "animationStartTime",
  get:()->
    @mozAnimationStartTime || Date.now()

CanvasRenderingContext2D::drawRect=(x,y,width,height)->
  @fillRect(x,y,width,height);
  @strokeRect(x,y,width,height);
  return

class Canvas
  element:null,
  ctx:null,
  constructor: (width, height) ->
    if (arguments.length==2)
      @element=document.createElement("canvas");
      @element.setAttribute("width", width + "px");
      @element.setAttribute("height", height + "px");
      @ctx=this.element.getContext("2d");
  toString:->
    $arg "Canvas(%, %)", @element.width,@element.height

  @fromId:(id)->
    canvas=new Canvas();
    canvas.element=document.getElementById(id);
    canvas.ctx=canvas.element.getContext("2d");
    return canvas;



