
g4.Natives=
  loadImage:(src,callback)->
    img=new Image()
    img.onload=()->
      callback({object:img,data:img,error:false})
    img.onerror=()->
      callback({object:img,data:null,error:true})
    img.src=src
    return img
  loadText:(src,callback)->
    xmlhttp=new XMLHttpRequest()
    xmlhttp.onload=()->
      callback({object:xmlhttp,data:xmlhttp.responseText,error:false})
    xmlhttp.onerror=()->
      callback({object:xmlhttp,data:null,error:true})
    xmlhttp.open "GET", src
    xmlhttp.send()
    return xmlhttp

  loadScript:(src,callback)->
    script = document.createElement("script")
    script.onload=()->
      callback({object:script,data:null,error:false})
    script.onerror=()->
      callback({object:script,data:null,error:true})
    script.src = src
    document.getElementsByTagName("head")[0].appendChild script
    return script

  #loadAudio:(src,loadCallback,errorCallback)->

  #loadTexVideo:(src,loadCallback,errorCallback)->
  _canvas:null
  _context:null
  getCanvas:()->
    if not @_canvas
      @_canvas=document.getElementsByTagName("canvas")[0]
      if not @_canvas or not @_canvas.getContext
        throw new Error("There is not canvas tag in the HTML")
    return @_canvas

  getContext:()->
    if not @_context
      @_context=@getCanvas().getContext("2d")
    return @_context;

  createContext:(width, height)->
    canvas=document.createElement("canvas")
    canvas.width=width
    canvas.height=height
    return canvas.getContext("2d")

