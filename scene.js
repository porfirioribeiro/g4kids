var Scene=Item.extend("Scene",{
    items:[],
    game:null,
    init:function(game){
//        if (!(game instanceof Game))
//            throw new TypeError("On new Scene(%t) got new Scene(%t)".arg(Game,game));
        if (!Class.typeCheck(arguments,Game))
            throw new TypeCheckError("Scene#init");
        this.game=game;
    },
    add:function(item,x,y){
        if (!$typeCheck(arguments,Item/*, Number, Number*/))
            throw new $typeCheck.error("Scene#add")
//        if (!(item instanceof Item))
//            throw new TypeError("TypeError on Scene#add(%t, %t, %t)".arg(Item,Number, Number));
        if (arguments.length>1){
            item.move(x,y);
        }
        item.scene=this;
        item.game=this.game;
        this.items.push(item);
        item.onCreate();
    },
    update:function(delta){
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].onUpdate(delta);
        }
    },
    draw:function(ctx){
        for (var i = 0; i < this.items.length; i++) {
            ctx.save();
            this.items[i].onDraw(ctx);
            ctx.restore();
        }
    }
});