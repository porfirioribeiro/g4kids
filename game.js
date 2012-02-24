var Game=Class.extend("Game",{
    paused:false,
    canvas:null,
    backBufferCanvas:null,
    canvasWidth:0,
    canvasHeight:0,
    startTime:0,
    fps:0,
    scene:null,
    init:function(canvas){
        this.canvas=canvas;
        this.canvasWidth=canvas.element.width;
        this.canvasHeight=canvas.element.height;
        this.backBufferCanvas=new Canvas(this.canvasWidth, this.canvasHeight);
        this.startTime=window.animationStartTime;
        //this.fps=0;
        this.scene=new Scene(this);
        Input.register(this.canvas.element);
        this._updateCallback=this._update.bind(this);
        window.requestAnimationFrame(this._updateCallback);
    },
    _update:function(time){
        var delta=time-this.startTime;
        this.fps=1000/delta;
        if (!this.paused)
            window.requestAnimationFrame(this._updateCallback);
        this.update(delta);

        this.startTime=time;

        this.backBufferCanvas.ctx.clearRect(0,0,this.canvas.element.width, this.canvas.element.height);
        this.draw(this.backBufferCanvas.ctx);
        this.canvas.ctx.clearRect(0,0,this.canvas.element.width, this.canvas.element.height);
        this.canvas.ctx.drawImage(this.backBufferCanvas.ctx.canvas,0,0);
        //this.draw(this.canvas.ctx);

    },
    update:function(delta){
        this.scene.update(delta);
        Input.update(delta);
    },
    draw:function(ctx){
        this.scene.draw(ctx);
    }
});