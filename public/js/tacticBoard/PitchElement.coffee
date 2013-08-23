class PitchElement

  board: null
  color: null
  fabricObject: null
  resizer: null
  
  @reverseColor: (color) ->
    if color is BoardController.guestColor then BoardController.homeColor else BoardController.guestColor
    
  @isPlayer: (object) ->
    object.type == 'group' && object.objects[0].type == 'circle'
    
  constructor: (params) ->
    @color = params.color or "black"
    if @board.editMode
      @initObserver()

  accountForEditMode: ->
    @fabricObject.selectable = @board.editMode

  initObserver: ->
    @board.fabricCanvas.observe
      'object:selected': @selectionListener
      'object:moving': @moveListener
      'before:selection:cleared': @deselectionListener

  selectionListener: (e) =>
    if @resizer
      if e.memo.target is @fabricObject
        r.show() for r in @resizer
      else if not @isPart(e.memo.target)
        @deselected()
    @fabricObject.set("opacity", 0.6) if @isPart(e.memo.target)

  moveListener: (e) =>
    if e.memo.target is @fabricObject
      @moved()

  deselectionListener: (e) =>
    if e.memo.target is @fabricObject
      @deselected()

  moved: =>
    if @resizer
      r.update() for r in @resizer

  deselected: =>
    @fabricObject.set("opacity", 1)
    if @resizer
      r.remove() for r in @resizer
      
  isPart: (element) =>
    isPart = false
    if @fabricObject is element
      isPart = true
    return isPart if not @resizer?
    for resizer in @resizer
      if resizer.fabricRect is element
        isPart = true
    isPart
  
  removeResizer: (index) ->
    if @resizer[index]
      @resizer[index].remove()
      @resizer.remove(@resizer[index])
  
  remove: =>
    @board.fabricCanvas.stopObserving
      'object:selected': @selectionListener
      'object:moving': @moveListener
      'before:selection:cleared': @deselectionListener
    console.debug @fabricObject
    if @fabricObject.type is "group"
      @board.remove(obj) for obj in @fabricObject.getObjects()
    if @resizer
      resizer.remove() for resizer in @resizer
    @board.remove(@fabricObject)
    true

class Resizer
  
  element: null
  fabricRect: null
  getCorner: null
  
  constructor: (pitchElement, getCorner) ->
    @element = pitchElement
    @getCorner = getCorner
    @element.board.fabricCanvas.observe
      'object:moving': @moving
      'before:selection:cleared': @deselected  

  moving: (e) =>
    if e.memo.target is @fabricRect
      @element.redraw()
      @element.board.fabricCanvas.bringForward(@fabricRect)

  deselected: (e) =>
    if e.memo.target = @fabricRect
      @element.deselected()

  show: ->
    console.debug @element
    if @fabricRect == null
      @fabricRect = @create()
      @element.board.add(@fabricRect)

  remove: ->
    @element.board.remove(@fabricRect)
    @fabricRect = null
    
  update: ->
    @fabricRect.left = @getCorner().x
    @fabricRect.top = @getCorner().y

  create: () ->
    resizer = new fabric.Rect(
      width: 12
      height: 12 
      left: @getCorner().x
      top: @getCorner().y 
      fill: '#5C9CCC'
      opacity: 0.85
    )
    resizer.selectable = true
    resizer.hasBorders = resizer.hasControls = false
    resizer
    
  getPoint: ->
    point = 
      x: @fabricRect.left
      y: @fabricRect.top