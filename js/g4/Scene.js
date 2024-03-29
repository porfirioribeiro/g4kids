// Generated by CoffeeScript 1.3.3

g4.module("g4.Scene");

g4.requires("g4.Item", "g4.Game");

g4.defines(function() {
  return g4.Scene = (function() {

    g4$Scene.className = 'g4.Scene';

    g4$Scene.prototype.items = [];

    g4$Scene.prototype.game = null;

    function g4$Scene(game) {
      var e;
      this.game = game;
      if ((e = g4.Type.check("g4.Scene#init", arguments, g4.Game))) {
        throw e;
      }
    }

    g4$Scene.prototype.add = function(item, x, y) {
      var e;
      if ((e = g4.Type.check("g4.Scene#add", arguments, g4.Item))) {
        throw e;
      }
      if (arguments.length > 1) {
        item.move(x, y);
      }
      item.scene = this;
      item.game = this.game;
      this.items.push(item);
      item.onCreate();
    };

    g4$Scene.prototype.update = function(delta) {
      var item, _i, _len, _ref;
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.onUpdate(delta);
      }
    };

    g4$Scene.prototype.draw = function(ctx) {
      var item, _i, _len, _ref;
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        ctx.save();
        item.onDraw(ctx);
        ctx.restore();
      }
    };

    return g4$Scene;

  })();
});
