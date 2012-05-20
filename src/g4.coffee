
Array.toArray=(ob)->
  return ob if ob instanceof Array
  return []   if ob==null or ob==undefined
  return Array.prototype.slice.call arguments if arguments.length>1
  return [ob] if typeof ob=="string"
  return Array.prototype.slice.call ob

g4={}
#Handle g4 global namespace
g4.global=window ? this
g4.global.g4=g4

g4.moduleRootPath=null
g4.modules={}
g4.modulesRequired={}
g4.modulesToLoad=0
g4.module_=(m)->
  if typeof m!="object" or typeof m.name!="string" or typeof m.defines!="function"
    throw "Bad module initialization"
  if @modules[m.name]
    throw "Already defined a module with the name: #{m.name}"

  @modules[m.name]=m
  m.loaded=false

  if m.requires instanceof Array
    for modName in m.requires
      #console.log "#{m.name} requires #{modName} that is #{if @modules[modName]then"loaded"else "not loaded"}"
      if !@modules[modName] and !@modulesRequired[modName]
        @modulesRequired[modName]=true
        @_loadModule(modName)

  if @modulesToLoad==0
    @_tryModules()

g4.lastModule=null
g4.module=(name)->
  if g4.lastModule
    throw new Error "Module: #{g4.lastModule.name} defines nothing!"
  if @modules[name]
    throw new Error "Module: Already defined a module with the name: #{name}"
  g4.lastModule=name:name,loaded:false

  return @

g4.mod=(name)->
  @modules[name]=name:name,loaded:true

g4.requires=(req)->
  if not g4.lastModule
    throw new Error "g4.Module: calling g4.requires without any module"
  req=Array.toArray.apply null, arguments
  if g4.lastModule.requires not instanceof Array
    g4.lastModule.requires=req
  else
    Array.prototype.push.apply g4.lastModule.requires,req
  return @

g4.defines=(fn)->
  if not g4.lastModule
    throw new Error "g4.Module: calling g4.defines without any module"

  g4.lastModule.defines=fn

  @modules[g4.lastModule.name]=g4.lastModule

  if g4.lastModule.requires instanceof Array
    for modName in g4.lastModule.requires
      #console.log "#{m.name} requires #{modName} that is #{if @modules[modName]then"loaded"else "not loaded"}"
      if !@modules[modName] and !@modulesRequired[modName]
        @modulesRequired[modName]=true
        @_loadModule(modName)

  if @modulesToLoad==0
    @_tryModules()

  g4.lastModule=null
  return @




for el in document.getElementsByTagName("script")
  if el.src.match(/g4\.js/)
    g4.moduleRootPath=el.src.replace(location.origin,"").replace(/g4\.js/,"")
    break

g4.modulePaths=
  __base:g4.moduleRootPath


g4.addModulePath=(prefix,path,relative=false)->
  @modulePaths[prefix]=if relative then @moduleRootPath+"/"+path else path



g4._loadModule=(modName)->
  #console.log "_loadModule "+modName
  @modulesToLoad++

  rootPath=@moduleRootPath
  mod=rootPath+modName

  modns=modName.split(".")
  if modns.length>1
    ns=modns[0]
    if typeof g4.modulePaths[ns]=="string"
      mod=g4.modulePaths[ns]+modName.replace(ns+".","")

  file=mod.replace(/\./g,"/")+".js"
  #console.log file
  script = document.createElement("script")
  script.onload=()=>
    #console.log script
    if --@modulesToLoad==0
      @_tryModules()
  script.onerror=()->
    throw new Error("Could not load the module with name: #{modName}! File not found: #{file}")
  script.src = file
  document.getElementsByTagName("head")[0].appendChild script
  return script

g4._tryModules=->
  for name,mod of @modules
    if not mod.loaded
      @_doModule mod
  return

g4._doModule=(mod)->
  #console.log "doModule: #{mod.name}"
  return if mod.loaded or mod.loading
  mod.loading=true
  if mod.requires instanceof Array
    for modName in mod.requires
      @_doModule @modules[modName]
  if typeof mod.defines=="function"
    mod.defines.call @global
  mod.loading=false
  mod.loaded=true
  return

###
Base of all g4 objects that can be constructed using a object literal
+ g4.Object
###
class g4.Object
  constructor:(o)->
    if typeof o=="object"
      for k,v of o
        @[k]=v
    @init() if typeof @init == "function"
  init:->

###
Little type utility
+ g4.Type
###
g4.mod "g4.Type"
class g4.Type
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
    objs = Array.prototype.slice.call(objs, 0)
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
      s_types=types.map(g4.Type.getClass).join(",")
      s_objs=objs.map(g4.Type.getClass).join(",")
      return new TypeError("No matching function for call to: #{fnName}(#{s_objs}), expected: #{fnName}(#{s_types})")
    return false

###
Special string concatenation
* $arg
###
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
  t:g4.Type.info
  c:g4.Type.getClass

String::arg = (args...)->
  args.unshift(@)
  return $arg.apply(null, args)


###
Signal-slot library
+ g4.Signal
* $signal
* $sender
* $prop
* $slot
###
$sender=null
$prop=(object,property)->
  object  : object
  property: property
$slot=(object,slot)->
  object:object
  slot  :slot

$signal=(owner)->new g4.Signal(owner)

g4.mod "g4.Signal"
class g4.Signal
  slots:[]
  isEmitting:false
  owner:null
  constructor:(@owner)->
  toSlotObject:(slot)->
    if slot instanceof g4.Signal or typeof slot=="function"
      slotObject=slot:slot
    else if typeof slot=="object"
      slotObject=slot
    else
      throw new Error "g4.Signal: Wrong argument, expected function, g4.Signal or object"+usages

    slotObject.object?=g4.global
    if typeof slotObject.slot=="string"
      slotObject.slot=slotObject.object[slotObject.slot]
    if typeof slotObject.property!="string" and typeof slotObject.slot!="function" and slotObject.slot not instanceof g4.Signal
      throw new Error "g4.Signal: Incorrect parameters"+usages
    return slotObject
  connect:(slot, args...)->
    slotObject=@toSlotObject(slot)
    if slotObject.args not instanceof Array
      slotObject.args=args
    @slots.push(slotObject);
    return slotObject
  disconnect:(slot)->
    s1=@toSlotObject(slot)
    console.log("disconnect: ",s1)
    nslots=@slots.slice(0)
    for s2,idx in nslots

      if  s1==s2 || (s1.slot==s2.slot and s1.object==s2.object and s1.property==s2.property)
        @slots.splice(idx,1)

    return
  disconnectAll=()->
    @slots=[]
    return

  emit:(args...)->
    return if @isEmitting # if this signal is emited and still emitting it will not emit
    @isEmitting=true
    for slotObject in @slots
      $sender=@owner
      nargs=args.slice(0)#copy args or we will get all args together
      Array.prototype.unshift.apply(nargs,slotObject.args)
      if slotObject.slot and not slotObject.slot.isEmitting
        slotObject.slot.apply slotObject.object,nargs
      else if slotObject.slot instanceof g4.Signal
        slotObject.slot.emit.apply slotObject.slot, nargs
      else if slotObject.property
        slotObject.object[slotObject.property]=nargs[0]#other args wont do nothing
      $sender=null
    @isEmitting=false
    return

  usages="""
    , usages are:
    $signal#connect($prop object, propertyName)
    $signal#connect($slot object, name)
    $signal#connect($slot object, function_signal)
    $signal#connect({object:object, slot:name}) where object[name] is a function or signal
    $signal#connect({object:object, slot:function_signal})
    $signal#connect(function_signal) can be slot,signal,...
   """

