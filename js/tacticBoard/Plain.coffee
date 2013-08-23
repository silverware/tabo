class Plain extends PitchElement
 
  points: []
  @type: "plain"

  constructor: (@board, args) ->
    super args
    @points[0] = 
      x: args.points[0].x * @board.width
      y: args.points[0].y * @board.height
    @points[1] = 
      x: args.points[1].x * @board.width
      y: args.points[1].y * @board.height
    @points[2] = 
      x: args.points[2].x * @board.width
      y: args.points[2].y * @board.height
    @points[3] = 
      x: args.points[3].x * @board.width
      y: args.points[3].y * @board.height
    
    @fabricObject = Plain.draw(@points, @board.width, @board.height, @color)
    @board.add(@fabricObject)
    @board.fabricCanvas.sendToBack(@fabricObject)
    @accountForEditMode()
    @resizer = []
    @resizer[0] = new Resizer(@, @getPoint1)
    @resizer[1] = new Resizer(@, @getPoint2)
    @resizer[2] = new Resizer(@, @getPoint3)
    @resizer[3] = new Resizer(@, @getPoint4)
    
  @draw: (points, canvasWidth, canvasHeight, color) ->
    group = new fabric.Group()
    Plain.drawCorners(group, points, color)

    for line in CanvasUtils.getDiagonalLines(canvasWidth, canvasHeight)
      intersect = fabric.Intersection.intersectLinePolygon(line.p1, line.p2, points)
      if intersect.status is "Intersection"
        start = intersect.points[0]
        stop = intersect.points[1]
        l = new fabric.Line [start.x, start.y,stop.x, stop.y],
          fill: color,
          strokeWidth: 0.9
        l.hasControls = l.hasBorders = l.selectable = false  
        group.add(l)

    group.hasControls = group.hasBorders = false
    group

  @drawCorners: (group, points, color) ->
    circle1 = new fabric.Circle
      fill: color
      radius: 1
      left: points[0].x
      top: points[0].y
      opacity: 95
				
    circle2 = new fabric.Circle
      fill: color
      radius: 1
      left: points[1].x
      top: points[1].y
      opacity: 95
      
    circle3 = new fabric.Circle
      fill: color
      radius: 1
      left: points[2].x
      top: points[2].y
      opacity: 95
      
    circle4 = new fabric.Circle
      fill: color
      radius: 1
      left: points[3].x
      top: points[3].y
      opacity: 95
    circle1.hasControls = circle1.hasBorders = circle1.selectable = false
    circle2.hasControls = circle2.hasBorders = circle2.selectable = false
    circle3.hasControls = circle3.hasBorders = circle3.selectable = false
    circle4.hasControls = circle4.hasBorders = circle4.selectable = false
    group.add(circle1)
    group.add(circle2)
    group.add(circle3)
    group.add(circle4)

  redraw: =>
    if @fabricObject
      @board.remove(@fabricObject)
    @fabricObject = Plain.draw([@resizer[0].getPoint(), @resizer[1].getPoint(), @resizer[2].getPoint(), @resizer[3].getPoint()], @board.width, @board.height, @color)
    @board.add(@fabricObject)
    @board.fabricCanvas.sendToBack(@fabricObject)

  getPoint1: =>
    p1 = 
      x: @fabricObject.left + @fabricObject.getObjects()[0].left
      y: @fabricObject.top + @fabricObject.getObjects()[0].top

  getPoint2: =>
    p2 = 
      x: @fabricObject.left + @fabricObject.getObjects()[1].left
      y: @fabricObject.top + @fabricObject.getObjects()[1].top
    
  getPoint3: =>
    p3 = 
      x: @fabricObject.left + @fabricObject.getObjects()[2].left
      y: @fabricObject.top + @fabricObject.getObjects()[2].top

  getPoint4: =>
    p4 = 
      x: @fabricObject.left + @fabricObject.getObjects()[3].left
      y: @fabricObject.top + @fabricObject.getObjects()[3].top

  serialize: ->
    @points = [@getPoint1(), @getPoint2(), @getPoint3(), @getPoint4()]
    obj = 
      type: Plain.type
      points: CanvasUtils.getRelativePoints(@points, @board.width, @board.height)
      color: @color