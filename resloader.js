var ResLoader={
    p: {},
    resources:{},
    resObjects:[],
    totalResources:0,
    erroredResources:0,
    nResources:0,
    plugins:{},
    status:{
      LOADED:"LOADED",
      LOADING: "LOADING",
      ERROR:"ERROR",
      TIMEOUT:"TIMEOUT"
    },
    started:false,
    loadTimeout:5000,
    addPlugin:function (name, baseName, ob) {
        if (typeof ResLoader.p[baseName + "Plugin"] !== "function" || typeof ob !== "object") {
            throw new TypeError("Arguments dont match: ResLoader.addPlugin(%t, %t, %t)".arg(String, String, Object));
        }
        ResLoader.p[name + "Plugin"] = ResLoader.p[baseName + "Plugin"].extend("ResLoader.p." + name + "Plugin", ob);
    },
    load:function(pluginName,name, src){
        if (!this.p[pluginName + "Plugin"])
            throw new Error("On ResLoader.load: The plugin named % is nor register in ResLoader".arg(pluginName));
        var plug=new this.p[pluginName + "Plugin"](name,src);
        if (this.started)
            plug.start();
        return plug;
    },
    loadFromObject:function(o){
        if (typeof o!=="object")
            throw new TypeError("Invalid arguments for: ResLoader.loadFromObject(%t), got %t".arg(Object,o));
        for (var pluginName in o){
            if (!this.p[pluginName + "Plugin"])
                throw new Error("On ResLoader.loadFromObject: The plugin named % is nor register in ResLoader".arg(pluginName));
            if (typeof o[pluginName]!=="object")
                throw new Error("On ResLoader.loadFromObject: Mallformed object");
            for (var resName in o[pluginName]){
                this.load(pluginName,resName,o[pluginName][resName]);
            }
        }
    },
    start:function(){
        this.resObjects.forEach(function(res){
            res.start();
        });
        this.started=true;
    },
    getProgress:function(){
      return (this.nResources*100)/this.totalResources;
    },
    _onLoad:function(res,status){
        this.nResources++;
        this.resources[res.name]=res.resource;
        this.onProgressChanged((this.nResources*100)/this.totalResources,status,res);
        if (this.nResources==this.totalResources){

            console.log("All loaded",$Res);
        }
    },
    onProgressChanged:function(/*progress,errored,res*/){}
};

var $Res=ResLoader.resources;

ResLoader.p.BasePlugin = Class.extend("ResLoader.p.BasePlugin", {
    resource:null,
    status:ResLoader.status.LOADING,
    name:"",
    src:"",
    init:function(name, src){
        this.name=name;
        this.src=src;
        ResLoader.resObjects.push(this);
    },
    start:function(){
        ResLoader.totalResources++;
        this._timeout=setTimeout(this.ontimeout.bind(this), ResLoader.loadTimeout);
    },
    onload:function(){
        ResLoader._onLoad(this,ResLoader.status.LOADED);
        clearTimeout(this._timeout);
    },
    onerror:function(){
        ResLoader._onLoad(this,ResLoader.status.ERROR);
        clearTimeout(this._timeout);
    },
    ontimeout:function(){
        ResLoader._onLoad(this,ResLoader.status.TIMEOUT);
    },
    _timeout:null
});

ResLoader.addPlugin("Image", "Base", {
    init:function(name, src){
        this._super(name,src);
        this.resource=new Image();
        this.resource.onload=this.onload.bind(this);
        this.resource.onerror=this.onerror.bind(this);
    },
    start:function(){
        this._super();
        this.resource.src=this.src;
    }
});

ResLoader.addPlugin("Text", "Base", {
    init: function (name, src) {
        this._super(name, src);
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.onreadystatechange = this.onreadystatechange.bind(this);
        this.httpRequest.open('GET', src);
    },
    start:function(){
        this._super();
        this.httpRequest.send();
    },
    onreadystatechange: function (/*e*/) {
        if (this.httpRequest.readyState === 4) {
            if (this.httpRequest.status === 200) {
                this.resource=this.httpRequest.responseText;
                this.onload();
            }
        }
    }
});

ResLoader.addPlugin("JSON","Text",{
    onload:function(){
        this.resource=JSON.parse(this.resource);
        this._super();
    }
});

ResLoader.addPlugin("ResList","Text",{
    onload:function(){
        this.resource=JSON.parse(this.resource);
        ResLoader.loadFromObject(this.resource);
        this._super();
        //setTimeout(this._super.bind(this), 1000);
    }
});

ResLoader.addPlugin("Script","Base",{
    init: function (name, src) {
        this._super(name, src);
        this.script=document.createElement('script');
        this.script.onload=this.onload.bind(this);
        this.script.onerror=this.onerror.bind(this);
    },
    start:function(){
        this._super();
        this.script.src=this.src;
        document.getElementsByTagName("head")[0].appendChild(this.script);
    }
});

//BEGIN:test
ResLoader.onProgressChanged=function(progress,status,res){
    console.log("Loaded resource: % Progress: %, Status: %, Res: %t".arg(res.name,progress,status,res.resource));
};


//ResLoader.loadFromObject({
//    "Image": {
//        "people1": "res/People1.png"
//    },
//    "JSON": {
//        "people": "res/People1.json"
//    },
//    "Script":{
//        "item":"item.js"
//    }
//});

ResLoader.load("ResList","list","res/res.json");

ResLoader.start();