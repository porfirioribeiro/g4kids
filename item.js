var Item=Class.extend("Item",{
    scene:null,
    game:null,
    x:0,
    y:0,
    move:function(x,y){
      this.x=x;
      this.y=y;
    },
    onCreate:function(){},
    onDestroy:function(){},
    onUpdate:function(delta){},
    onDraw:function(ctx){}
});