uniqueId = (length=8) ->
  id = ""
  id += Math.random().toString(36).substr(2) while id.length < length
  id.substr 0, length

class Player extends PitchElement

  id: null
  label: null
  x: null
  y: null
  position: null
  number: null
  home: null
  
  @radius: 0.019
  @innerRadius: 0.015
  @fontSize: 0.019
  @type: "player"
  @numberLabel: "number"
  @positionLabel: "position"
  
  constructor: (@board, args) ->
    @[key] = val for key, val of args
    @arrows = []
    @color = if @home then BoardController.homeColor else BoardController.guestColor
    @type = Player.type
    @draw()
    @drawArrows args.arrows if args.arrows
    @accountForEditMode()
    @initObserver()

  draw: ->
    console.debug("draw Player: " + @label)
    outerCircle = new fabric.Circle({
      radius: @board.width * Player.radius, 
      left: @x * @board.width, 
      top: @y * @board.height, 
      fill: @position["part"], 
      opacity: 1
    })
    overlay = new fabric.Circle({
      radius: @board.width * Player.radius, 
      left: @x * @board.width, 
      top: @y * @board.height, 
      opacity: 0
    })
    innerCircle = new fabric.Circle({
      radius: @board.width * Player.innerRadius, 
      left: @x * @board.width, 
      top: @y * @board.height,  
      fill: @color, 
      opacity: 1
    })
    text = new fabric.Text(@number, { 
      fontFamily: 'CrashCTT_400', 
      left: @x * @board.width, 
      top: @y * @board.height, 
      fontSize: Player.fontSize * @board.width,
      textAlign: "center",
      fill: PitchElement.reverseColor(@color)
    })
    group = new fabric.Group()
    group.add(outerCircle)
    group.add(innerCircle)
    group.add(text)
    group.add(overlay)
    outerCircle.hasControls = outerCircle.hasBorders = false
    innerCircle.hasControls = innerCircle.hasBorders = false
    text.hasControls = text.hasBorders = false
    overlay.hasControls = overlay.hasBorders = false
    group.hasControls = group.hasBorders = false
    @fabricObject = group
    @updatePlayerLabel()
    @board.add(group)

  drawArrows: (arrowData) ->
    for data in arrowData
      @addArrow data

  initObserver: ->
    @board.fabricCanvas.observe
      'object:moving': @onMove

  onMove: (e) =>
    if e.memo.target is @fabricObject or (e.memo.target.type is "group" and e.memo.target.contains(@fabricObject))
      @updatePosition()
      for arrow in @arrows
        x = @fabricObject.left - arrow.getStart().x
        y = @fabricObject.top - arrow.getStart().y
        arrow.fabricObject.left += x
        arrow.fabricObject.top += y

  addArrow: (arrowParams) ->
    @updatePosition()
    arrow = new PlayerArrow(@board, @, arrowParams)
    @arrows.push(arrow)

  contains: (point) ->
    return @fabricObject.containsPoint(point)

  highlight: (highlight) ->
    console.debug highlight
    @fabricObject.item(1).setOpacity(if highlight then 0.6 else 0.95)
    @board.updateCanvas()

  showNumber: ->
    @fabricObject.item(2).setText(@number)
    @board.updateCanvas()
		 
  showPosition: ->
    @fabricObject.item(2).setText(@board.positions()[@position].label + "")
    @board.updateCanvas()
	
  updatePlayerLabel: ->
    if @board.playerLabel is Player.numberLabel
      @showNumber()
    else if @board.playerLabel is Player.positionLabel
      @showPosition()
    @fabricObject.item(0).setFill(@board.positions()[@position].part)
    @board.updateCanvas()

  update: (params) ->
    if params.position then @position = params.position
    if params.label then @label = params.label
    if params.number then @number = params.number
    @updatePlayerLabel()

  removeSelectedArrow: (fabricObject) ->
    toRemove = []
    for arrow in @arrows when arrow.fabricObject is fabricObject
      arrow.remove()
      toRemove.push arrow
    @arrows.remove arrow for arrow in toRemove

  remove: ->
    @board.fabricCanvas.stopObserving
      'object:moving': @onMove
    arrow.remove() for arrow in @arrows
    @board.controller.removePlayer(@)
    super()
    
  serialize: ->
    @updatePosition()
    arrows = []
    arrows.push(arrow.serialize()) for arrow in @arrows
    obj =
      type: Player.type
      id: @id
      x: @x
      y: @y
      label: @label
      number: @number 
      home: @home
      position: @position
      arrows: arrows

  updatePosition: ->
    radius = @fabricObject.item(0).radius;
    @x = (@fabricObject.getCenter().x - radius) / @board.width
    @y = (@fabricObject.getCenter().y - radius) / @board.height