class ResLoader
  @resources       : {}
  @resObjects      : []
  @totalResources  : 0
  @erroredResources: 0
  @nResources      : 0
  @started         : false
  @loadTimeout     : 5000
  @status          :
    LOADED : "LOADED"
    LOADING: "LOADING"
    ERROR  : "ERROR"
    TIMEOUT: "TIMEOUT"

  @load: (pluginName, name, src)->
    if not @[pluginName]
      throw new Error("On ResLoader.load: The plugin named #{pluginName} is nor register in ResLoader")
    plug=new @[pluginName](name,src)
    plug.start() if (this.started)
    return plug
  @loadFromObject: (o)->
    if (e=Type.check "ResLoader.loadFromObject",arguments,Object) then throw e
    for pluginName,oo of o
      if not @[pluginName]
        throw new Error("On ResLoader.load: The plugin named #{pluginName} is nor register in ResLoader")
      if typeof o[pluginName] != "object"
        throw new Error("On ResLoader.loadFromObject: Mallformed object")
      for name,src of oo
        @load pluginName, name, src
    return
  @start:()->
    @resObjects.forEach (res)->
      res.start()
    @started=true
    return
  @getProgress:()->
    (@nResources*100) / @totalResources

  @_onLoad:(res,status)->
    @nResources++
    @resources[res.name]=res.resource
    @onProgressChanged (@nResources*100) / @totalResources,status,res
    if (@nResources==@totalResources)
      console.log("All loaded",$Res)
    return
  @onProgressChanged: (progress,errored,res)->


$Res = ResLoader.resources

class ResLoader.Base
  resource: null,
  status  : ResLoader.status.LOADING,
  name    : "",
  src     : "",
  _timeout: null

  constructor: (@name, @src)->
    ResLoader.resObjects.push(this)

  start: ()->
    ResLoader.totalResources++
    @_timeout = setTimeout(@ontimeout, ResLoader.loadTimeout)
    return

  onload: ()=>
    ResLoader._onLoad(this, ResLoader.status.LOADED)
    clearTimeout(@_timeout)
    return

  onerror: ()=>
    ResLoader._onLoad(this, ResLoader.status.ERROR)
    clearTimeout(@_timeout)
    return

  ontimeout: ()=>
    ResLoader._onLoad(this, ResLoader.status.TIMEOUT)
    return

class ResLoader.Image extends ResLoader.Base
  constructor: (name, src) ->
    super name, src
    @resource = new window.Image()  #or we will get a recursion bug
    @resource.onload = @onload
    @resource.onerror = @onerror

  start: ->
    super
    @resource.src = @src
    return

class ResLoader.Text extends ResLoader.Base
  httpRequest: null
  constructor: (name, src) ->
    super name, src
    @httpRequest = new XMLHttpRequest()
    @httpRequest.onreadystatechange = @onreadystatechange
    @httpRequest.open "GET", src

  start: ->
    super
    @httpRequest.send()
    return

  onreadystatechange: =>
    if @httpRequest.readyState is 4
      if @httpRequest.status is 200
        @resource = @httpRequest.responseText
        @onload()
    return

class ResLoader.JSON extends ResLoader.Text
  onload: ->
    @resource = window.JSON.parse(@resource)
    super
    return

class ResLoader.ResList extends ResLoader.Text
  onload: ->
    @resource = window.JSON.parse(@resource)
    ResLoader.loadFromObject @resource
    super
    return

class ResLoader.Script extends ResLoader.Base
  script     : null
  constructor: (name, src) ->
    super name, src
    @script = document.createElement("script")
    @script.onload = @onload
    @script.onerror = @onerror
    @script.src = @src

  start: ->
    super
    document.getElementsByTagName("head")[0].appendChild @script
    return

#BEGIN:test
ResLoader.onProgressChanged= (progress,status,res)->
  console.log("Loaded resource: % Progress: %, Status: %, Res: %t".arg(res.name,progress,status,res.resource));


ResLoader.load("ResList","list","res/res.json");

ResLoader.start();
