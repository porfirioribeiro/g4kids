class Type
  @info    : (object_or_class)->
    if (typeof object_or_class == "function")
      return object_or_class.name
    else if (typeof object_or_class == "object" && object_or_class)
      return "[object " + object_or_class.constructor.name + "]"
    return "" + Object.prototype.toString.call(object_or_class)
  @getClass: (object_or_class)->
    if (typeof object_or_class == "function")
      return if typeof object_or_class.className=="string" then object_or_class.className else object_or_class.name
    if (typeof object_or_class == "undefined")
      return "undefined"
    else #if (typeof object_or_class=="object")
      if object_or_class
        return if typeof object_or_class.constructor.className=="string" then object_or_class.constructor.className else object_or_class.constructor.name
      else
        return "null"
  @check   : (fnName, objs, types...)->
    objs = [].slice.call(objs, 0)
    matchs=[]
    i=0
    for type in types
      obj=objs[i++]
      r=(type == Object && typeof obj == "object") ||
      (type == String && typeof obj == "string") ||
      (type == Number && typeof obj == "number") ||
      (type == Boolean && typeof obj == "boolean") ||
      (type == Function && typeof obj == "function") ||
      (obj instanceof type)
      matchs[i] = r
    if (!r)
      s_types=types.map(Type.getClass).join(",")
      s_objs=objs.map(Type.getClass).join(",")
      return new TypeError("No matching function for call to: #{fnName}(#{s_objs}), expected: #{fnName}(#{s_types})")
    return false

String::arg = (args...)->
  args.unshift(@)
  return $arg.apply(null, args)

$arg = (string, args...)->
  if typeof string != "string"
    string = if string && string.toString then string.toString() else ""
  i=0
  s=string.replace `/%%|%(\w?)/g`, (match, ref)->
    arg=args[i++]
    if match == "%%"
      return "%"
    if ref!="" and typeof $arg.fn[ref]=="function"
      return $arg.fn[ref](arg)
    return "" + arg
  return s

$arg.fn=
  t:Type.info
  c:Type.getClass