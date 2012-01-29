/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();

Class.prototype.className="Class";
Class.prototype.toString=function(){
    return "[object "+this.className+"]";
  //return "[object %]".arg(this.name);  
};

/**
 * String argument concatnation 
 */
 
 
String.prototype.arg= function(arg1){
    var i=0;
    var args=arguments;
    var s= this.replace(/%%|%([t]?)/g,function(match,ref){
        var arg=args[i++];
        if (match=="%%"){
            return "%";
        }
        if (ref=="t"){
            if (arg instanceof Class){
                return "[object "+arg.className+"]";
            }
            return ""+Object.prototype.toString.call(arg);
        }
        return ""+arg;
    });
    return s;
};
 

/*String.prototype.arg=function(arg0, arg1, argetc){
    var s=this;
    for (var i=0;i<arguments.length;i++){
        s=s.replace(/%/,"arg="+arguments[i]);
    }
    return s;
};
String.prototype.argT=String.prototype.arg
function(arg0, arg1, argetc){
    var s=this;
    for (var i=0;i<arguments.length;i++){
        if (arguments[i] instanceof Class){
            s=s.replace(/%/,"argT:Class="+arguments[i]);
        }
        s=s.replace(/%/,"argT="+Object.prototype.toString.call(arguments[i]));
    }
    return s;    
};*/