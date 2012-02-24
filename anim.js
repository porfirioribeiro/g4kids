
if (!window.requestAnimationFrame)
    window.requestAnimationFrame=
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                window.setTimeout(function(){
                    callback(Date.now());
                }, 1000 / 60);
              };

//mozAnimationStartTime
Object.defineProperty(window,"animationStartTime",{
   get:function(){
        return this.mozAnimationStartTime || Date.now();
   }
});


window.CanvasRenderingContext2D.prototype.drawRect=function(x,y,width,height){
    this.fillRect(x,y,width,height);
    this.strokeRect(x,y,width,height);
};


var Canvas=Class.extend("Canvas",{
    className:"Canvas",
    element:null,
    ctx:null,
    init:function(width, height){
        if (arguments.length==2){
            this.element=document.createElement("canvas");
            this.element.setAttribute("width", width + "px");
            this.element.setAttribute("height", height + "px");
            this.ctx=this.element.getContext("2d");
        }
    },

    toString:function(){
        return "Canvas(%, %)".arg(this.element.width,this.element.height);
    }
});

Canvas.fromId=function(id){
    var canvas=new Canvas();
    canvas.element=document.getElementById(id);
    canvas.ctx=canvas.element.getContext("2d");
    return canvas;
};


