// Generated by CoffeeScript 1.3.3

g4.Natives = {
  loadImage: function(src, callback) {
    var img;
    img = new Image();
    img.onload = function() {
      return callback({
        object: img,
        data: img,
        error: false
      });
    };
    img.onerror = function() {
      return callback({
        object: img,
        data: null,
        error: true
      });
    };
    img.src = src;
    return img;
  },
  loadText: function(src, callback) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
      return callback({
        object: xmlhttp,
        data: xmlhttp.responseText,
        error: false
      });
    };
    xmlhttp.onerror = function() {
      return callback({
        object: xmlhttp,
        data: null,
        error: true
      });
    };
    xmlhttp.open("GET", src);
    xmlhttp.send();
    return xmlhttp;
  },
  loadScript: function(src, callback) {
    var script;
    script = document.createElement("script");
    script.onload = function() {
      return callback({
        object: script,
        data: null,
        error: false
      });
    };
    script.onerror = function() {
      return callback({
        object: script,
        data: null,
        error: true
      });
    };
    script.src = src;
    document.getElementsByTagName("head")[0].appendChild(script);
    return script;
  },
  _canvas: null,
  _context: null,
  getCanvas: function() {
    if (!this._canvas) {
      this._canvas = document.getElementsByTagName("canvas")[0];
      if (!this._canvas || !this._canvas.getContext) {
        throw new Error("There is not canvas tag in the HTML");
      }
    }
    return this._canvas;
  },
  getContext: function() {
    if (!this._context) {
      this._context = this.getCanvas().getContext("2d");
    }
    return this._context;
  },
  createContext: function(width, height) {
    var canvas;
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext("2d");
  }
};