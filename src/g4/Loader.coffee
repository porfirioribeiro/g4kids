g4.module "g4.Loader"

g4.defines ->

  class g4.Loader
    @status:
      IDLE   : "IDLE"
      LOADED : "LOADED"
      LOADING: "LOADING"
      ERROR  : "ERROR"
      TIMEOUT: "TIMEOUT"
    @currentLoader:null


    status:null
    loadList:null
    resources:null
    nResources:0
    started:false
    loadTimeout: 5000

    constructor:->
      @status=g4.Loader.status.IDLE
      @loadList=[]
      @resources={}
      @nResources=0

    load:(pluginName,name,src)->
      pluginClass=g4.Loader[pluginName];
      if not pluginClass
        throw new Error("On g4.Loader#load: The plugin named #{pluginName} is nor register in g4.Loader")
      plugin=new pluginClass @, name, src
      plugin.start() if @started
      @loadList.push plugin
      return plugin
    loadFromObject: (o)->
      if (e=g4.Type.check "g4.Loader#loadFromObject",arguments,Object) then throw e
      for pluginName,oo of o
        if not g4.Loader[pluginName]
          throw new Error("On g4.Loader#loadFromObject: The plugin named #{pluginName} is nor register in g4.Loader")
        if typeof o[pluginName] != "object"
          throw new Error("On ResLoader.loadFromObject: Mallformed object")
        for name,src of oo
          @load pluginName, name, src
      return
    start:()->
      @status=g4.Loader.status.LOADING
      g4.Loader.currentLoader=this
      @loadList.forEach (res)->
        res.start()
      @started=true
      g4.Loader.currentLoader=null
      return

    #_onLoad
    onResourceLoad:(loader,status)->
      @nResources++
      @resources[loader.name]=loader.resource;

      if status == g4.Loader.status.ERROR or status == g4.Loader.status.TIMEOUT
        @status = status
        @onError()

      if @nResources == @loadList.length
        @status=g4.Loader.status.LOADED
        @onLoad()

    onError:->
      console.error "Huston, we got a problem!"

    onLoad:->
      console.log "All your resources are belong to us! I mean, loaded!"




  class g4.Loader.Base
    loader:null
    name:""
    src:""
    resource:null
    status:g4.Loader.status.IDLE
    _timeout=null
    constructor:(@loader,@name,@src)->

    start:->
      @status=g4.Loader.status.LOADING
      @_timeout = setTimeout(@finish.bind(@, g4.Loader.status.TIMEOUT), @loader.loadTimeout)
      return

    finish:(status)->
      #console.log "#{@constructor.className}#finish(#{status})"
      @loader.onResourceLoad(@, status)
      clearTimeout(@_timeout)
      return
    toString:->
      "#{@constructor.className}(name: '#{@name}', src: '#{@src}')"

  class g4.Loader.Image extends g4.Loader.Base

    start:->
      super
      @resource=new Image()
      @resource.onload=@finish.bind @, g4.Loader.status.LOADED
      @resource.onerror=@finish.bind @, g4.Loader.status.ERROR
      @resource.src=@src


  class g4.Loader.Script extends g4.Loader.Base
    start:->
      super


  class g4.Loader.Text extends g4.Loader.Base
    httpRequest: null
    start: ->
      super
      @httpRequest = new XMLHttpRequest()
      @httpRequest.onreadystatechange = @onreadystatechange
      @httpRequest.open "GET", @src
      @httpRequest.send()
      return

    onreadystatechange: =>
      if @httpRequest.readyState is 4
        @resource = @httpRequest.responseText
        @finish if @httpRequest.status == 200 then g4.Loader.status.LOADED else g4.Loader.status.ERROR
      return


  class g4.Loader.JSON extends g4.Loader.Text
    finish:(status)->
      if status==g4.Loader.status.LOADED
        @resource = JSON.parse(@resource)
      super status

  class g4.Loader.List extends g4.Loader.Text
    finish:(status)->
      if status==g4.Loader.status.LOADED
        @loader.loadFromObject(JSON.parse(@resource))
        @resource=null #TODO we dont need a resource here
      super status


  loader=new g4.Loader()

#  loader.loadFromObject
#    "Image":
#      "people1":"res/People1.png"
#    "JSON":
#      code:"res/People1.json"
  loader.load "List","_res","res/res.json"


  loader.start()

