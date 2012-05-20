_g=(window ? this)

$sender=_g.$sender=null

$prop=_g.$prop=(object,property)->
  object  : object
  property: property

$slot=_g.$slot=(object,slot)->
  object:object
  slot  :slot

$signal=_g.$signal=(owner)->

  signal=(args...)->
    if (signal.isEmitting) # if this signal is emited and still emitting it will not emit
      return
    signal.isEmitting=true
    for slotObject in signal.slots
      $sender=owner
      nargs=args
      Array.prototype.unshift.apply(nargs,slotObject.args)
      if slotObject.slot and not slotObject.slot.isEmitting
        slotObject.slot.apply slotObject.object,nargs
      else if slotObject.property
        slotObject.object[slotObject.property]=nargs[0]#other args wont do nothing
      $sender=null
    signal.isEmitting=false
    return
  signal.slots=[]
  signal.isSignal=true
  signal.isEmitting=false
  signal.haveSlots=false
  signal.emitWith=(sender, args...)->
    owner=sender
    signal.apply(null, args)
    return

  usages="""
  , usages are:
  $signal#connect($prop object, propertyName)
  $signal#connect($slot object, functionName)
  $signal#connect($slot object, function)
  $signal#connect({object:object, slot:functionName}) where object[functionName] is a function (slot,signal,...)
  $signal#connect({object:object, slot:function})
  $signal#connect(function) can be slot,signal,...
 """
  signal.connect=(slot, args...)->
    if typeof slot=="object"
      slotObject=slot
      slotObject.object?=_g
      if !slotObject.property
        slotObject.slot=if typeof slotObject.slot=="function" then slotObject.slot else slotObject.object[slotObject.slot]
        if (typeof slotObject.slot!="function")
          #console.log slotObject
          throw new Error "$signal#connect: Incorrect parameters"+usages
    else if typeof slot=="function"
      slotObject=slot:slot
    else
      throw new Error "$signal#connect: Wrong argument, expected function or object"+usages
    if slotObject.args not instanceof Array
      slotObject.args=args
    signal.slots.push(slotObject);
    return

  signal.disconnect=(slot)->
    idx=signal.slots.indexOf(slot)
    signal.slots.splice(idx,1) if idx>-1
    return
  signal.disconnectAll=()->
    signal.slots=[]
    return
  return signal