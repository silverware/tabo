class Board

  canvasId: null
  fabricCanvas: null
  pitchElements: []
  width: null
  height: null
  controller: null
  playerLabel: null
  editMode: false

  constructor: (controller, canvasId, editMode, data) ->
    @playerLabel = data?.playerLabel or Player.numberLabel
    @canvasId = canvasId
    @fabricCanvas = new fabric.Canvas(@canvasId)
    @width = $("#" + @canvasId).width()
    @height = $("#" + @canvasId).height()
    @controller = controller
    @editMode = editMode
    @initCanvas(data?.pitchElements)

  players: -> 
    (item for item in @pitchElements when item.type is Player.type)

  getTeamSize: (isHome) ->
    size = 0
    size++ for player in @players() when player.home is isHome
    size

  add: (object) ->
    @fabricCanvas.add(object)
    @fabricCanvas.renderAll()
  
  remove: (object) ->
    if !object
      return
    if object.type is "group"
      @fabricCanvas.remove(obj) for obj in object.getObjects()
    @fabricCanvas.remove(object)
    @fabricCanvas.renderAll()

  removePitchElement: (element) =>
    return if !element
    if element.remove()
      @pitchElements.remove(element)

  getPitchElementByFabricObject: (object) ->
    for pitchElement in @pitchElements
      if pitchElement.fabricObject is object
        return pitchElement
      
  addPlayer: (isHome) ->
    if @getTeamSize(isHome) < @maxTeamSize
      player = @getNewPlayer()
      player.home = isHome
      player = @addPitchElement player
    player  
    
  addPitchElement: (data) -> 
    switch data.type
      when "arrow" then element = new Arrow(@, data)
      when "plain" then element = new Plain(@, data)
      when "player" then element = new Player(@, data)
      when "path" then element = new Path(@, data)
    @pitchElements.push(element)
    element

  initCanvas: (data) ->
    if @width == 150
      imageTarget = 'img/pitch_150.jpg'
    else
      imageTarget = 'img/pitch_650.jpg'
    @fabricCanvas.setBackgroundImage(imageTarget, @fabricCanvas.renderAll.bind(@fabricCanvas))
    if data
      @addPitchElement(element) for element in data
    else
      @addPitchElement(value) for key, value of @initialHomePlayerData()
      @addPitchElement(value) for key, value of @initialGuestPlayerData()  
    @fabricCanvas.renderAll.bind(@fabricCanvas)
    if @editMode
      @initDeleteListener()
      @initGroupSelectionListener()
      
  initDeleteListener: ->
    document.onkeydown = (event) =>
        return if not event?
        if event.keyCode is 46
          activeObject = @fabricCanvas.getActiveObject()
          if activeObject
            player.removeSelectedArrow activeObject for player in @players()
            @removePitchElement(@getPitchElementByFabricObject(activeObject))

  initGroupSelectionListener: ->
    @fabricCanvas.observe "selection:created", (event) =>
      group = event.memo.target
      if not @isPitchElement(group)
        group.hasControls = false
  
  isPitchElement: (group) =>
    for element in @pitchElements when element.fabricObject is group
      return element
    return false
  
  updateCanvas: ->
    @fabricCanvas.renderAll()

  showNumbers: ->
    @playerLabel = Player.numberLabel
    player.showNumber() for player in @players()

  showPositions: ->
    @playerLabel = Player.positionLabel
    player.showPosition() for player in @players()

  serializePitchElements: ->
    pitchElements = []
    pitchElements.push pitchElement.serialize() for pitchElement in @pitchElements
    pitchElements

  serialize: ->
    obj = 
      pitchElements: @serializePitchElements()
      playerLabel: @playerLabel

  load: (data) ->
    @setSettings(data.settings)
    @pitchElements.push(PitchElement.create(pitchElementData)) for pitchElementData in data.pitchElements
			
  enableSelectableItems:(bool) ->
      object.selectable = bool for object in @fabricCanvas.getObjects()

#################################### ArrowDrawing #####################################################

  enableArrowDrawing: ->
    console.debug("arrow Drawing")
    @enableSelectableItems(false)
    @fabricCanvas.observe('mouse:down', @onArrowMouseDown)
    @fabricCanvas.observe('mouse:move', @onArrowMouseMove)
    @fabricCanvas.observe('mouse:up', @onArrowMouseUp)

  disableArrowDrawing: ->
    @enableSelectableItems(true)
    @fabricCanvas.stopObserving('mouse:up', @onArrowMouseUp)
    @fabricCanvas.stopObserving('mouse:move', @onArrowMouseMove)
    @fabricCanvas.stopObserving('mouse:down', @onArrowMouseDown)
	
  onArrowMouseDown: (e) =>
    CanvasUtils.tempObj.startPoint = CanvasUtils.getMouseOnCanvas(e, @canvasId)

  onArrowMouseMove: (e) =>
    if (CanvasUtils.tempObj.obj != null)
      @remove(CanvasUtils.tempObj.obj)
    point = CanvasUtils.getMouseOnCanvas(e, @canvasId)
    if (CanvasUtils.tempObj.startPoint != null)
      coords = [CanvasUtils.tempObj.startPoint.x, CanvasUtils.tempObj.startPoint.y, point.x, point.y]
      arrow = Arrow.draw(coords, @controller.toolbar.color())
      @fabricCanvas.add(arrow)
      @fabricCanvas.sendToBack(arrow)
      CanvasUtils.tempObj.obj = arrow

  onArrowMouseUp: (e) =>
    if (CanvasUtils.tempObj.obj != null)
      stopPoint = CanvasUtils.getMouseOnCanvas(e, @canvasId)
      startPoint = CanvasUtils.tempObj.startPoint
      coords = [startPoint.x, startPoint.y, stopPoint.x, stopPoint.y]
      @remove(CanvasUtils.tempObj.obj)
      playerArrow = false
      for player in @players() when player.contains({x: startPoint.x, y: startPoint.y})
         player.addArrow({stopPoint: CanvasUtils.getRelativePoint(stopPoint, @width, @height), color: @controller.toolbar.color()})
         playerArrow = true
         break
      if not playerArrow
        @pitchElements.push(new Arrow(@, {coords: CanvasUtils.getRelativeCoords(coords, @width, @height), color: @controller.toolbar.color()}))
        
    CanvasUtils.tempObj = 
      obj: null
      startPoint: null

#################################### PlainDrawing #####################################################

  enableRectDrawing: ->
    @enableSelectableItems(false)
    @fabricCanvas.observe('mouse:down', @onRectMouseDown)
    @fabricCanvas.observe('mouse:move', @onRectMouseMove)
    @fabricCanvas.observe('mouse:up', @onRectMouseUp)

  disableRectDrawing: ->
    @enableSelectableItems(true)
    @fabricCanvas.stopObserving('mouse:up', @onRectMouseUp)
    @fabricCanvas.stopObserving('mouse:move', @onRectMouseMove)
    @fabricCanvas.stopObserving('mouse:down', @onRectMouseDown)
	
  onRectMouseDown: (e) =>
    CanvasUtils.tempObj.startPoint = CanvasUtils.getMouseOnCanvas(e, @canvasId)
	
  onRectMouseMove:(e) =>
    if (CanvasUtils.tempObj.obj != null) 
      @remove(CanvasUtils.tempObj.obj)
    if (CanvasUtils.tempObj.startPoint != null)
      startPoint = CanvasUtils.tempObj.startPoint
      stopPoint = CanvasUtils.getMouseOnCanvas(e, @canvasId)
      point2 = 
        x: startPoint.x 
        y: stopPoint.y
      point3 =
        x: stopPoint.x
        y: startPoint.y
      rect = Plain.draw([startPoint, point2, stopPoint, point3], @width, @height, @controller.toolbar.color())
      @add(rect)
      CanvasUtils.tempObj.obj = rect

  onRectMouseUp: (e) =>
    if (CanvasUtils.tempObj.obj != null)
      stopPoint = CanvasUtils.getMouseOnCanvas(e, @canvasId)
      startPoint = CanvasUtils.tempObj.startPoint
      point2 = 
        x: startPoint.x 
        y: stopPoint.y
      point3 =
        x: stopPoint.x
        y: startPoint.y
      @remove(CanvasUtils.tempObj.obj)
      @pitchElements.push(new Plain(@, {points: CanvasUtils.getRelativePoints([startPoint, point2, stopPoint, point3], @width, @height), @width, @height,  color: @controller.toolbar.color()}))  
    CanvasUtils.tempObj = 
      obj: null
      startPoint: null
      
      
#################################### PathDrawing #####################################################

  enablePathDrawing: ->
    @enableSelectableItems(false)
    @fabricCanvas.isDrawingMode = true
    @fabricCanvas.freeDrawingLineWidth = 3
    @fabricCanvas.freeDrawingColor = @controller.toolbar.color()
    document.body.style.cursor = "pointer"
    @fabricCanvas.observe('path:created', @onPathCreated)

  disablePathDrawing: ->
    @enableSelectableItems(true)
    @fabricCanvas.isDrawingMode = false
    document.body.style.cursor = "default"
    @fabricCanvas.stopObserving('path:created', @onPathCreated)
	
  onPathCreated: (e) =>
    console.debug e
    path = e.memo.path
    @remove path
    @pitchElements.push(new Path(@,
      path: Path.relativePaths(path.path, @width, @height)
      width: path.width / @width
      height: path.height / @height
      left: path.left / @width
      top: path.top / @height
      color: @controller.toolbar.color()
    ))