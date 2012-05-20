g4.module "g4.Input"
g4.defines ->
  class g4.Input
    @element:null
    @bindedKeys:{}
    @actions:{}
    @anyKey:false
    @_anyKeyLock:false
    @mouse:
      x:0
      y:0
      moving:false
      leftDown:false
      leftUp:false
      middleDown:true
      middleUp:true
      rightDown:false
      rightUp:false
      clicked:false
      contextMenu:false
    _mouse=@mouse
    Object.defineProperty @, "mouse",
      get:()->
        return _mouse if not @element
        #console.log("Initialzing mouse")
        @enableMouse()
        Object.defineProperty @, "mouse",
          value:_mouse
          writeable:false
        return _mouse
      configurable:true
    @setCursor:(cursor)->
      if (e=g4.Type.check "g4.Input#setCursor",arguments,String) then throw e
      this.element.style.cursor=cursor;
    @register:(@element)->
      if (e=g4.Type.check "g4.Input#register",arguments,Element) then throw e
      #this.enableKeyBoard();
      #this.enableMouse()
      this.element.style.outline= "none";
      #this.element.contentEditable=true;
      this.element.tabIndex=0;
      this.element.focus();
      return
    @keyBoardEnabled:false
    @enableKeyBoard:()->
      if not @keyBoardEnabled
        @keyBoardEnabled=true
        window.addEventListener("keydown", this.onKeyDown, false);
        window.addEventListener("keyup", this.onKeyUp, false);
      return
    @disableKeyBoard:()->
      if @keyBoardEnabled
        @keyBoardEnabled=false
        window.removeEventListener("keydown", this.onKeyDown, false);
        window.removeEventListener("keyup", this.onKeyUp, false);
      return
    @mouseEnabled:false
    @enableMouse:()->
      if not @mouseEnabled
        @mouseEnabled=true
        this.element.addEventListener("mousedown", this.onMouseDown, false);
        this.element.addEventListener("mouseup", this.onMouseUp, false);
        this.element.addEventListener("mousemove", this.onMouseMove, false);
        this.element.addEventListener("mouseover", this.onMouseOver, false);
        this.element.addEventListener("mouseout", this.onMouseOut, false);
        this.element.addEventListener("click", this.onClick, false);
        this.element.addEventListener("contextmenu", this.onContextMenu, false);
      return
    @disableMouse:()->
      if @mouseEnabled
        @mouseEnabled=false
        this.element.removeEventListener("mousedown", this.onMouseDown, false);
        this.element.removeEventListener("mouseup", this.onMouseUp, false);
        this.element.removeEventListener("mousemove", this.onMouseMove, false);
        this.element.removeEventListener("mouseover", this.onMouseOver, false);
        this.element.removeEventListener("mouseout", this.onMouseOut, false);
        this.element.removeEventListener("click", this.onClick, false);
      return
    @update:(time)->
      if @mouseEnabled
        this.mouse.moving=false;
        this.mouse.clicked=false;
        this.mouse.contextMenu=false;
      @anyKey=false
      for name,action of @actions
        if action.toGoUP
          action.locked=false
          action.active=false
        action.toGoUP=false
        action.pressed=false
      return

    @bind:(key,actionName)->
      if not @keyBoardEnabled
        @enableKeyBoard()
      if key of @bindedKeys
        throw "g4.Input.bind: Already binded this key";
      if actionName of @actions
        action=@actions[actionName]
      else
        action=new g4.Input.Action(actionName)
        @actions[actionName]=action
      @bindedKeys[key]=action
      action.keys.push(key);
      return

    @connect:(actionName,slot)->
      if actionName of @actions
        @actions[actionName].signal.connect(slot)
      return
    @disconnect:(actionName,slot)->
      if actionName of @actions
        @actions[actionName].signal.disconnect(slot)
      return

    #Events
    @onKeyDown:(e)=>
      @anyKey=true if not @_anyKeyLock
      @_anyKeyLock=true
      action=@bindedKeys[e.keyCode]
      if action
        action.active=true
        if not action.locked
          action.pressed=true;
          action.locked=true;
          if action.signal.slots.length>0
            action.signal.emit()
        return stopEvent(e);
      return
    @onKeyUp:(e)=>
      @_anyKeyLock=false
      action=@bindedKeys[e.keyCode]
      if action
        action.toGoUP=true
        return stopEvent(e);
      return
    @onMouseDown:(e)=>
      this.element.focus();
      switch e.button
        when 0 then this.mouse.leftDown=true;
        when 1 then this.mouse.middleDown=true;
        when 2 then this.mouse.rightDown=true;
      return stopEvent(e);
    @onMouseUp:(e)=>
      switch e.button
        when 0 then this.mouse.leftDown=false;
        when 1 then this.mouse.middleDown=false;
        when 2 then this.mouse.rightDown=false;
      return stopEvent(e);
    @onMouseMove:(e)=>
      #console.log($arg "e.clientY=% offsetTop=% scrollTop=%", e.clientY , this.element.offsetTop , document.body.scrollTop)
      this.mouse.x = e.clientX - this.element.offsetLeft + this.element.ownerDocument.body.scrollLeft;
      this.mouse.y = e.clientY - this.element.offsetTop + this.element.ownerDocument.body.scrollTop;
      this.mouse.moving=true;
      return stopEvent(e);
    @onMouseOver:(e)=>
      this.element.focus();
      #console.log($arg "mouseover %t", e);
      return stopEvent(e);
    @onMouseOut:(e)=>
      #console.log($arg "mouseout %t",e);
      return stopEvent(e);
    @onClick:(e)=>
      this.mouse.clicked=true;
      #console.log($arg "click %t", e);
      return stopEvent(e);
    @onContextMenu:(e)=>
      this.mouse.contextMenu=true;
      return stopEvent(e);
    #private stuff
    stopEvent=(e)->
      e.preventDefault?()
      e.stopPropagation?()
      e.returnValue = false
      e.cancelBubble = true
      return false;

  #Keys
  g4.keys=
  #ANY   : 0
    LEFT  : 37
    UP    : 38
    RIGHT : 39
    DOWN  : 40
    ENTER : 13
    SHIFT : 16
    CTRL  : 17
    ALT   : 18
    PAUSE : 19
    ESC   : 27
    SPACE : 32
    NUM0  : 48
    NUM1  : 49
    NUM2  : 50
    NUM3  : 51
    NUM4  : 52
    NUM5  : 53
    NUM6  : 54
    NUM7  : 55
    NUM8  : 56
    NUM9  : 57
    A     : 65
    B     : 66
    C     : 67
    D     : 68
    E     : 69
    F     : 70
    G     : 71
    H     : 72
    I     : 73
    J     : 74
    K     : 75
    L     : 76
    M     : 77
    N     : 78
    O     : 79
    P     : 80
    Q     : 81
    R     : 82
    S     : 83
    T     : 84
    U     : 85
    V     : 86
    W     : 87
    X     : 88
    Y     : 89
    Z     : 90

  g4.cursors=
    auto      : "auto"
    crosshair : "crosshair"
    def       : "default"
    help      : "help"
    move      : "move"
    nResize   : "n-resize"
    wResize   : "w-resize"
    eResize   : "e-resize"
    sResize   : "s-resize"
    neResize  : "ne-resize"
    nwResize  : "nw-resize"
    seResize  : "se-resize"
    swResize  : "sw-resize"
    pointer   : "pointer"
    progress  : "progress"
    text      : "text"
    wait      : "wait"

  class g4.Input.Action
    constructor:(@name)->
      @signal=$signal @
    action:null
    name:""
    locked:false
    pressed:false
    active:false
    toGoUP:false
    keys:[]