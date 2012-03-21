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
  Class.extend = function(className,prop) {
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

    Class.className=className;
    Class.toString=function(){
        return className;
    };
    Class.prototype.toString=function(){
        return "[object "+className+"]";
    };
    return Class;
  };
})();

Class.className="Class";

Class.typeInfo = function (o_or_c) {
    if (typeof o_or_c == "function") {
        if (o_or_c.prototype instanceof Class || o_or_c.className) {
            return o_or_c.className;
        } else {
            var re = /function (\w*)\(\) \{ \[native code\] \}/;
            var subject = Object.toString.call(o_or_c);
            var match = re.exec(subject);
            if (match !== null) {
                return match[1];
            } else {
                return subject;
            }
        }
    } else if (typeof o_or_c == "object") {
        if (o_or_c instanceof Class) {
            return "[object " + o_or_c.constructor.className + "]";
        }
    }
    return "" + Object.prototype.toString.call(o_or_c);
};

Class.typeCheck = function(/*args,T1,T2,T3*/){
    var objs=Array.prototype.slice.call(arguments[0]);
    var types=Array.prototype.slice.call(arguments,1);
    var matchs=[];
    for (var i=0;i<types.length;i++){
        var type=types[i];
        var obj=objs[i];
        var r=(type==Object && typeof obj=="object") ||
              (type==String && typeof obj=="string") ||
              (type==Number && typeof obj=="number") ||
              (type==Boolean && typeof obj=="boolean") ||
              (type==Function && typeof obj=="function") ||
              (obj instanceof type);
        matchs[i]=r;
        if (!r){
            //no matching function for call to 'QCoreApplication::QCoreApplication(int&, char**&, int, int, int)
            //
            TypeCheckError.lastError={
              types:types,
              objs:objs
            };
            return false;
            //return new TypeError("typeCheck: Types not match, expected(%) got(%)".arg(types.map(Class.typeInfo).join(","),objs.map(Class.typeInfo).join(",")));
        }
//        console.log("Type %t, Obj %t, check: %".arg(type,obj,r));
    }
    return true;
};


function TypeCheckError(fnName) {
    this.name = "TypeCheckError";
    if (!TypeCheckError.lastError || !TypeCheckError.lastError.types || !TypeCheckError.lastError.objs){
        this.message = "Default Message";
    }else{
        var types=TypeCheckError.lastError.types.map(Class.typeInfo).join(",");
        var objs =TypeCheckError.lastError.objs.map(Class.typeInfo).join(",");
        this.message="No matching function for call to: "+fnName+"("+objs+"), expected: "+fnName+"("+types+")";
    }
    TypeCheckError.lastError=null;
}
TypeCheckError.lastError=null;
TypeCheckError.prototype = new TypeError();
TypeCheckError.prototype.constructor = TypeCheckError;

var $typeCheck=Class.typeCheck;
$typeCheck.error=TypeCheckError;

/**
 * String argument concatnation
 */
String.prototype.arg= function(arg1){
    var i=0;
    var args=arguments;
    var s= this.replace(/%%|%([t]?)/g,function(match,ref){
        var arg=args[i++];
        console.log("match: ",match," ","ref");
        if (match=="%%"){
            return "%";
        }
        if (ref=="t"){
            return Class.typeInfo(arg);
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