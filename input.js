
var Input={
    element:null,
    mouse:{
      x:0,
      y:0,
      moving:false,
      leftDown:false,
      leftUp:false,
      middleDown:true,
      middleUp:true,
      rightDown:false,
      rightUp:false,
      clicked:false,
      contextMenu:false
    },
    mouseMoving:false,
    mouseX:0,
    mouseY:0,
    setCursor:function(cursor){
        if (typeof cursor!="string")
            throw new TypeError("Input.setCursor(%t) got %t".arg(String,cursor));
        this.element.style.cursor=cursor;
    },
    register:function(element){
        if (!(element instanceof Element))
            throw new TypeError("Element expected on Input.register(%t)".arg(element));
        this.element=element;
        this.bindFunctions();
        this.enableKeyboard();
        this.enableMouse();
        this.element.style.outline= "none";
        //this.element.contentEditable=true;
        this.element.tabIndex=0;
        this.element.focus();
    },
    enableKeyboard:function(){
        this.element.addEventListener("keydown", this.boundEvents.onKeyDown, false);
        this.element.addEventListener("keyup", this.boundEvents.onKeyUp, false);
    },
    disableKeyboard:function(){
        this.element.removeEventListener("keydown", this.boundEvents.onKeyDown, false);
        this.element.removeEventListener("keyup", this.boundEvents.onKeyUp, false);
    },
    enableMouse:function(){
        this.element.addEventListener("mousedown", this.boundEvents.onMouseDown, false);
        this.element.addEventListener("mouseup", this.boundEvents.onMouseUp, false);
        this.element.addEventListener("mousemove", this.boundEvents.onMouseMove, false);
        this.element.addEventListener("mouseover", this.boundEvents.onMouseOver, false);
        this.element.addEventListener("mouseout", this.boundEvents.onMouseOut, false);
        this.element.addEventListener("click", this.boundEvents.onClick, false);
        this.element.addEventListener("contextmenu", this.boundEvents.onContextMenu, false);
    },
    disableMouse:function(){
        this.element.removeEventListener("mousedown", this.boundEvents.onMouseDown, false);
        this.element.removeEventListener("mouseup", this.boundEvents.onMouseUp, false);
        this.element.removeEventListener("mousemove", this.boundEvents.onMouseMove, false);
        this.element.removeEventListener("mouseover", this.boundEvents.onMouseOver, false);
        this.element.removeEventListener("mouseout", this.boundEvents.onMouseOut, false);
        this.element.removeEventListener("click", this.boundEvents.onClick, false);
    },
    update:function(time){
        this.mouse.moving=false;
        this.mouse.clicked=false;
        this.mouse.contextMenu=false;
    },
    bindFunctions:function(){
        for (var e in this.events){
            this.boundEvents[e]=this.events[e].bind(this);
        }
    },
    boundEvents:{
    },
    events:{
        onKeyDown:function(e){
            console.log("keydown %t".arg(e));
            return e.stopEvent();
        },
        onKeyUp:function(e){
            console.log("keyup %t".arg(e));
            return e.stopEvent();
        },
        onMouseDown:function(e){
            this.element.focus();
            switch (e.button) {
                case 0:
                    this.mouse.leftDown=true;
                    break;
                case 1:
                    this.mouse.middleDown=true;
                    break;
                case 2:
                    this.mouse.rightDown=true;
                    break;
            }
            return e.stopEvent();
        },
        onMouseUp:function(e){
            switch (e.button) {
                case 0:
                    this.mouse.leftDown=false;
                    break;
                case 1:
                    this.mouse.middleDown=false;
                    break;
                case 2:
                    this.mouse.rightDown=false;
                    break;
            }
            return e.stopEvent();
        },
        onMouseMove:function(e){
            //  console.log("e.clientY=% offsetTop=% scrollTop=%".arg(e.clientY , this.element.offsetTop , document.body.scrollTop))
            this.mouse.x = e.clientX - this.element.offsetLeft + this.element.ownerDocument.body.scrollLeft;
            this.mouse.y = e.clientY - this.element.offsetTop + this.element.ownerDocument.body.scrollTop;
            this.mouse.moving=true;
            return e.stopEvent();
        },
        onMouseOver:function(e){
            this.element.focus();
            //console.log("mouseover %t".arg(e));
            return e.stopEvent();
        },
        onMouseOut:function(e){
            //console.log("mouseout %t".arg(e));
            return e.stopEvent();
        },
        onClick:function(e){
            this.mouse.clicked=true;
            //console.log("click %t".arg(e));
            return e.stopEvent();
        },
        onContextMenu:function(e){
            this.mouse.contextMenu=true;
            return e.stopEvent();
        }
    },
    keys:{
        LEFT : 37,
        UP : 38,
        RIGHT : 39,
        DOWN : 40,
        ENTER : 13,
        SHIFT : 16,
        CTRL : 17,
        ALT : 18,
        PAUSE : 19,
        ESC : 27,
        SPACE : 32,
        NUM0 : 48,
        NUM1 : 49,
        NUM2 : 50,
        NUM3 : 51,
        NUM4 : 52,
        NUM5 : 53,
        NUM6 : 54,
        NUM7 : 55,
        NUM8 : 56,
        NUM9 : 57,
        A : 65,
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85,
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90
    },
    cursors:{
        auto:"auto",
        crosshair:"crosshair",
        def:"default",
        eResize:"e-resize",
        help:"help",
        move:"move",
        nResize:"n-resize",
        neResize:"ne-resize",
        nwResize:"nw-resize",
        pointer:"pointer",
        progress:"progress",
        sResize:"s-resize",
        seResize:"se-resize",
        swResize:"sw-resize",
        text:"text",
        wResize:"w-resize",
        wait:"wait"
    }
};

Event.prototype.stopEvent=function(){
    if (this.preventDefault)
        this.preventDefault();
    this.stopPropagation();
    this.returnValue = false;
    this.cancelBubble = true;
    return false;
};