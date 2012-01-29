
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
      clicked:false
    },
    mouseMoving:false,
    mouseX:0,
    mouseY:0,
    register:function(element){
        if (!(element instanceof Element))
            throw new TypeError("Element expected on Input.register(%t)".arg(element));
        this.element=element;
        this.enableKeyboard();
        this.enableMouse();
        this.element.style.outline= "none";
        //this.element.contentEditable=true;
        this.element.tabIndex=0;
        this.element.focus();
    },
    enableKeyboard:function(){
        this.element.addEventListener("keydown", this.onKeyDown, false);
        this.element.addEventListener("keyup", this.onKeyUp, false);
    },
    disableKeyboard:function(){
        this.element.removeEventListener("keydown", this.onKeyDown, false);
        this.element.removeEventListener("keyup", this.onKeyUp, false);
    },
    enableMouse:function(){
        this.element.addEventListener("mousedown", this.onMouseDown, false);
        this.element.addEventListener("mouseup", this.onMouseUp, false);
        this.element.addEventListener("mousemove", this.onMouseMove, false);
        this.element.addEventListener("mouseover", this.onMouseOver, false);
        this.element.addEventListener("mouseout", this.onMouseOut, false);
        this.element.addEventListener("click", this.onClick, false);
        this.element.addEventListener("contextmenu", this.onContextMenu, false);
    },  
    disableMouse:function(){
        this.element.removeEventListener("mousedown", this.onMouseDown, false);
        this.element.removeEventListener("mouseup", this.onMouseUp, false);
        this.element.removeEventListener("mousemove", this.onMouseMove, false);
        this.element.removeEventListener("mouseover", this.onMouseOver, false);
        this.element.removeEventListener("mouseout", this.onMouseOut, false);
        this.element.removeEventListener("click", this.onClick, false);
    },
    preventDefault:function(evt) {
        if (evt.preventDefault)
            evt.preventDefault();
        evt.stopPropagation();
        evt.returnValue = false;
        evt.cancelBubble = true;
        return false;
    },
    onKeyDown:function(e){
        console.log("keydown %t".arg(e));
        return Input.preventDefault(e);
    },
    onKeyUp:function(e){
        console.log("keyup %t".arg(e));
        return Input.preventDefault(e);
    },
    onMouseDown:function(e){
        Input.element.focus();
        switch (e.button) {
            case 0:
                Input.mouse.leftDown=true;
                break;
            case 1:
                Input.mouse.middleDown=true;
                break;
            case 2:
                Input.mouse.rightDown=true;
                break;
        }
        return Input.preventDefault(e);
    },
    onMouseUp:function(e){
        switch (e.button) {
            case 0:
                Input.mouse.leftDown=false;
                break;
            case 1:
                Input.mouse.middleDown=false;
                break;
            case 2:
                Input.mouse.rightDown=false;
                break;
        }
        return Input.preventDefault(e);
    },
    onMouseMove:function(e){
        Input.mouse.x = e.clientX - Input.element.offsetLeft;
        Input.mouse.y = e.clientY - Input.element.offsetTop;
        Input.mouse.moving=true;
        return Input.preventDefault(e);
    },
    onMouseOver:function(e){
        Input.element.focus();
        console.log("mouseover %t".arg(e));
        return Input.preventDefault(e);
    },
    onMouseOut:function(e){
        //console.log("mouseout %t".arg(e));
        return Input.preventDefault(e);
    },
    onClick:function(e){
        console.log("click %t".arg(e));
        return Input.preventDefault(e);
    },
    onContextMenu:function(e){
        
        return Input.preventDefault(e);
    },
    update:function(time){
        this.mouse.moving=false;
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
    }
};