// Generated by CoffeeScript 1.3.1
var tictactoe,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

tictactoe = {};

g4.module("tictactoe.Game");

g4.requires("g4.Game", "g4.Item");

g4.defines(function() {
  g4.Font = (function() {
    var internalContext;

    g4$Font.className = 'g4.Font';

    internalContext = document.createElement("canvas").getContext("2d");

    function g4$Font() {}

    g4$Font.prototype.family = "Arial";

    g4$Font.prototype.size = 128;

    g4$Font.prototype.measureText = function(text) {
      var dim;
      internalContext.font = this;
      console.log(internalContext.font);
      dim = internalContext.measureText(text);
      dim.height = this.size;
      return dim;
    };

    g4$Font.prototype.toString = function() {
      return "" + this.size + "px " + this.family;
    };

    return g4$Font;

  })();
  tictactoe.Piece = (function(_super) {

    __extends(tictactoe$Piece, _super);

    tictactoe$Piece.className = 'tictactoe.Piece';

    tictactoe$Piece.prototype.font = null;

    tictactoe$Piece.prototype.size = null;

    tictactoe$Piece.prototype.text = "O";

    function tictactoe$Piece() {
      this.font = new g4.Font();
      this.size = this.font.measureText(this.text);
    }

    tictactoe$Piece.prototype.onUpdate = function(delta) {
      return this.move(g4.Input.mouse.x, g4.Input.mouse.y);
    };

    tictactoe$Piece.prototype.onDraw = function(ctx) {
      ctx.font = this.font;
      ctx.fillRect(this.x, this.y, this.size.width, this.size.height);
      ctx.fillStyle = "red";
      ctx.textBaseline = "top";
      return ctx.fillText(this.text, this.x, this.y);
    };

    return tictactoe$Piece;

  })(g4.Item);
  return tictactoe.Game = (function(_super) {

    __extends(tictactoe$Game, _super);

    tictactoe$Game.className = 'tictactoe.Game';

    function tictactoe$Game(canvas) {
      var cursor;
      tictactoe$Game.__super__.constructor.call(this, canvas);
      cursor = new tictactoe.Piece();
      this.scene.add(cursor);
    }

    return tictactoe$Game;

  })(g4.Game);
});
