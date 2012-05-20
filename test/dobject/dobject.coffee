console.log "---"

g4={}
class g4.Object
  constructor:(o)->
    if typeof o=="object"
      for k,v of o
        @[k]=v
    @init() if typeof @init == "function"
  init:->


class g4.Font extends g4.Object
  @Style=
    Normal: "Normal"
    Bold: "Bold"
    Italic: "Italic"
  name: ""
  size: 10
  style: @Style.Normal

class g4.Text extends g4.Object
  x: 0
  y: 0
  font: null
  text: ""

class g4.Rect extends g4.Object
  x: 0
  y: 0
  width: 0
  height: 0
  text: null


r=new g4.Rect
  x: 10
  y: 10
  width: 100
  height: 100
  text: new g4.Text
    x: 5
    y: 5
    font: new g4.Font
      name: "Arial"
      size: 20
      style: g4.Font.Style.Bold

  init:->
    console.log this.text.font.style




#console.log t+""