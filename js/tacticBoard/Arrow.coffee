class Arrow extends PitchElement
  
  coords: null
  @type: "arrow"

  constructor: (@board, args) ->
    super args
    @coords = [args.coords[0] * @board.width
      args.coords[1] * @board.height
      args.coords[2] * @board.width
      args.coords[3] * @board.height]
    @fabricObject = Arrow.draw(@coords, @color)
    @board.add(@fabricObject)
    @accountForEditMode()
    @resizer = []
    @resizer.push(new Resizer(@, @getStart))
    @resizer.push(new Resizer(@, @getStop))

  @draw: (coords, color) ->
    color = color or 'black'
    group = new fabric.Group()
    circleStart = new fabric.Circle
      fill: color
      radius: 2
      left: coords[0]
      top: coords[1]
      opacity: 95
				
    circleStop = new fabric.Circle
      fill: color
      radius: 2
      left: coords[2]
      top: coords[3]
      opacity: 95
		
    line = new fabric.Line coords,
      fill: color,
      strokeWidth: 3

    circleStart.hasControls = circleStart.hasBorders = circleStart.selectable = false
    circleStop.hasControls = circleStop.hasBorders = circleStop.selectable = false
    line.hasControls = line.hasBorders = line.selectable = false
    group.hasControls = group.hasBorders = group.selectable = false
    group.selectable = true
    group.add(circleStart)
    group.add(circleStop)
    group.add(line)
    
    Arrow.drawArrowHead(group, coords, color)
    return group

  @drawArrowHead: (group, coords, color) ->
    point1 = 
      x: coords[2]
      y: coords[3]
    vector = CanvasUtils.vector(point1, {x: coords[0], y: coords[1]})  
    vector1 = CanvasUtils.mul(CanvasUtils.rotateVector(vector, 0.6), 10)
    vector2 = CanvasUtils.mul(CanvasUtils.rotateVector(vector, -0.6), 10)
    point2 = CanvasUtils.add(point1, vector1)
    point3 = CanvasUtils.add(point1, vector2)
    console.debug vector
    console.debug vector1
    l1 = new fabric.Line [point1.x, point1.y, point2.x, point2.y],
      strokeWidth: 2
      fill: color
    l2 = new fabric.Line [point1.x, point1.y, point3.x, point3.y],
      strokeWidth: 2
      fill: color
    l1.hasControls = l1.hasBorders = l1.selectable = false
    l2.hasControls = l2.hasBorders = l2.selectable = false  
    group.add(l1)
    group.add(l2)

  redraw: =>
    if @fabricObject
      @board.remove(@fabricObject)
    @fabricObject = Arrow.draw([@resizer[0].fabricRect.left, @resizer[0].fabricRect.top, @resizer[1].fabricRect.left, @resizer[1].fabricRect.top], @color)
    @board.add(@fabricObject)
    @board.fabricCanvas.sendBackwards(@fabricObject)
    @board.fabricCanvas.sendBackwards(@fabricObject)
    @board.fabricCanvas.sendBackwards(@fabricObject)

  getStart: =>
    start = 
      x: @fabricObject.left + @fabricObject.getObjects()[0].left
      y: @fabricObject.top + @fabricObject.getObjects()[0].top

  getStop: =>
    stop = 
      x: @fabricObject.left + @fabricObject.getObjects()[1].left
      y: @fabricObject.top + @fabricObject.getObjects()[1].top

  serialize: ->
    {
      type: Arrow.type
      coords: [@getStart().x / @board.width, @getStart().y / @board.height, @getStop().x / @board.width, @getStop().y / @board.height]
      color: @color
    }