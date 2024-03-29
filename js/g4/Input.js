// Generated by CoffeeScript 1.3.3

g4.module("g4.Input");

g4.defines(function() {
  g4.Input = (function() {
    var stopEvent, _mouse;

    g4$Input.className = 'g4.Input';

    function g4$Input() {}

    g4$Input.element = null;

    g4$Input.bindedKeys = {};

    g4$Input.actions = {};

    g4$Input.anyKey = false;

    g4$Input._anyKeyLock = false;

    g4$Input.mouse = {
      x: 0,
      y: 0,
      moving: false,
      leftDown: false,
      leftUp: false,
      middleDown: true,
      middleUp: true,
      rightDown: false,
      rightUp: false,
      clicked: false,
      contextMenu: false
    };

    _mouse = g4$Input.mouse;

    Object.defineProperty(g4$Input, "mouse", {
      get: function() {
        if (!this.element) {
          return _mouse;
        }
        this.enableMouse();
        Object.defineProperty(this, "mouse", {
          value: _mouse,
          writeable: false
        });
        return _mouse;
      },
      configurable: true
    });

    g4$Input.setCursor = function(cursor) {
      var e;
      if ((e = g4.Type.check("g4.Input#setCursor", arguments, String))) {
        throw e;
      }
      return this.element.style.cursor = cursor;
    };

    g4$Input.register = function(element) {
      var e;
      this.element = element;
      if ((e = g4.Type.check("g4.Input#register", arguments, Element))) {
        throw e;
      }
      this.element.style.outline = "none";
      this.element.tabIndex = 0;
      this.element.focus();
    };

    g4$Input.keyBoardEnabled = false;

    g4$Input.enableKeyBoard = function() {
      if (!this.keyBoardEnabled) {
        this.keyBoardEnabled = true;
        window.addEventListener("keydown", this.onKeyDown, false);
        window.addEventListener("keyup", this.onKeyUp, false);
      }
    };

    g4$Input.disableKeyBoard = function() {
      if (this.keyBoardEnabled) {
        this.keyBoardEnabled = false;
        window.removeEventListener("keydown", this.onKeyDown, false);
        window.removeEventListener("keyup", this.onKeyUp, false);
      }
    };

    g4$Input.mouseEnabled = false;

    g4$Input.enableMouse = function() {
      if (!this.mouseEnabled) {
        this.mouseEnabled = true;
        this.element.addEventListener("mousedown", this.onMouseDown, false);
        this.element.addEventListener("mouseup", this.onMouseUp, false);
        this.element.addEventListener("mousemove", this.onMouseMove, false);
        this.element.addEventListener("mouseover", this.onMouseOver, false);
        this.element.addEventListener("mouseout", this.onMouseOut, false);
        this.element.addEventListener("click", this.onClick, false);
        this.element.addEventListener("contextmenu", this.onContextMenu, false);
      }
    };

    g4$Input.disableMouse = function() {
      if (this.mouseEnabled) {
        this.mouseEnabled = false;
        this.element.removeEventListener("mousedown", this.onMouseDown, false);
        this.element.removeEventListener("mouseup", this.onMouseUp, false);
        this.element.removeEventListener("mousemove", this.onMouseMove, false);
        this.element.removeEventListener("mouseover", this.onMouseOver, false);
        this.element.removeEventListener("mouseout", this.onMouseOut, false);
        this.element.removeEventListener("click", this.onClick, false);
      }
    };

    g4$Input.update = function(time) {
      var action, name, _ref;
      if (this.mouseEnabled) {
        this.mouse.moving = false;
        this.mouse.clicked = false;
        this.mouse.contextMenu = false;
      }
      this.anyKey = false;
      _ref = this.actions;
      for (name in _ref) {
        action = _ref[name];
        if (action.toGoUP) {
          action.locked = false;
          action.active = false;
        }
        action.toGoUP = false;
        action.pressed = false;
      }
    };

    g4$Input.bind = function(key, actionName) {
      var action;
      if (!this.keyBoardEnabled) {
        this.enableKeyBoard();
      }
      if (key in this.bindedKeys) {
        throw "g4.Input.bind: Already binded this key";
      }
      if (actionName in this.actions) {
        action = this.actions[actionName];
      } else {
        action = new g4.Input.Action(actionName);
        this.actions[actionName] = action;
      }
      this.bindedKeys[key] = action;
      action.keys.push(key);
    };

    g4$Input.connect = function(actionName, slot) {
      if (actionName in this.actions) {
        this.actions[actionName].signal.connect(slot);
      }
    };

    g4$Input.disconnect = function(actionName, slot) {
      if (actionName in this.actions) {
        this.actions[actionName].signal.disconnect(slot);
      }
    };

    g4$Input.onKeyDown = function(e) {
      var action;
      if (!g4$Input._anyKeyLock) {
        g4$Input.anyKey = true;
      }
      g4$Input._anyKeyLock = true;
      action = g4$Input.bindedKeys[e.keyCode];
      if (action) {
        action.active = true;
        if (!action.locked) {
          action.pressed = true;
          action.locked = true;
          if (action.signal.slots.length > 0) {
            action.signal.emit();
          }
        }
        return stopEvent(e);
      }
    };

    g4$Input.onKeyUp = function(e) {
      var action;
      g4$Input._anyKeyLock = false;
      action = g4$Input.bindedKeys[e.keyCode];
      if (action) {
        action.toGoUP = true;
        return stopEvent(e);
      }
    };

    g4$Input.onMouseDown = function(e) {
      g4$Input.element.focus();
      switch (e.button) {
        case 0:
          g4$Input.mouse.leftDown = true;
          break;
        case 1:
          g4$Input.mouse.middleDown = true;
          break;
        case 2:
          g4$Input.mouse.rightDown = true;
      }
      return stopEvent(e);
    };

    g4$Input.onMouseUp = function(e) {
      switch (e.button) {
        case 0:
          g4$Input.mouse.leftDown = false;
          break;
        case 1:
          g4$Input.mouse.middleDown = false;
          break;
        case 2:
          g4$Input.mouse.rightDown = false;
      }
      return stopEvent(e);
    };

    g4$Input.onMouseMove = function(e) {
      g4$Input.mouse.x = e.clientX - g4$Input.element.offsetLeft + g4$Input.element.ownerDocument.body.scrollLeft;
      g4$Input.mouse.y = e.clientY - g4$Input.element.offsetTop + g4$Input.element.ownerDocument.body.scrollTop;
      g4$Input.mouse.moving = true;
      return stopEvent(e);
    };

    g4$Input.onMouseOver = function(e) {
      g4$Input.element.focus();
      return stopEvent(e);
    };

    g4$Input.onMouseOut = function(e) {
      return stopEvent(e);
    };

    g4$Input.onClick = function(e) {
      g4$Input.mouse.clicked = true;
      return stopEvent(e);
    };

    g4$Input.onContextMenu = function(e) {
      g4$Input.mouse.contextMenu = true;
      return stopEvent(e);
    };

    stopEvent = function(e) {
      if (typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      if (typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
      e.returnValue = false;
      e.cancelBubble = true;
      return false;
    };

    return g4$Input;

  }).call(this);
  g4.keys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    ESC: 27,
    SPACE: 32,
    NUM0: 48,
    NUM1: 49,
    NUM2: 50,
    NUM3: 51,
    NUM4: 52,
    NUM5: 53,
    NUM6: 54,
    NUM7: 55,
    NUM8: 56,
    NUM9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90
  };
  g4.cursors = {
    auto: "auto",
    crosshair: "crosshair",
    def: "default",
    help: "help",
    move: "move",
    nResize: "n-resize",
    wResize: "w-resize",
    eResize: "e-resize",
    sResize: "s-resize",
    neResize: "ne-resize",
    nwResize: "nw-resize",
    seResize: "se-resize",
    swResize: "sw-resize",
    pointer: "pointer",
    progress: "progress",
    text: "text",
    wait: "wait"
  };
  return g4.Input.Action = (function() {

    g4$Input$Action.className = 'g4.Input.Action';

    function g4$Input$Action(name) {
      this.name = name;
      this.signal = $signal(this);
    }

    g4$Input$Action.prototype.action = null;

    g4$Input$Action.prototype.name = "";

    g4$Input$Action.prototype.locked = false;

    g4$Input$Action.prototype.pressed = false;

    g4$Input$Action.prototype.active = false;

    g4$Input$Action.prototype.toGoUP = false;

    g4$Input$Action.prototype.keys = [];

    return g4$Input$Action;

  })();
});
