class Path extends PitchElement
 
  @type: "path"

  constructor: (@board, args) ->
    super args
    args.width = args.width * @board.width
    args.height = args.height * @board.height
    args.left = args.left * @board.width
    args.top = args.top * @board.height
    args.path = Path.absolutePaths(args.path, @board.width, @board.height)
    @fabricObject = Path.draw(args, @color)
    console.debug @fabricObject
    @board.add(@fabricObject)
    @accountForEditMode()

  @relativePaths: (paths, width, height) ->
    p = []
    for path in paths
      p.push([path[0], path[1] / width, path[2] / height])
    p

  @absolutePaths: (paths, width, height) ->
    p = []
    for path in paths
      p.push([path[0], path[1] * width, path[2] * height])
    p

  @draw: (options, color) ->
    path = new fabric.Path options.path, 
      left: options.left
      top: options.top
      width: options.width
      height: options.height
      stroke: color
      strokeWidth: 3
      fill: ''
    path.hasBorders = path.hasControls = false
    path
      
  serialize: ->
    obj = 
      type: Path.type
      width: @fabricObject.width / @board.width
      height: @fabricObject.height / @board.height
      left: @fabricObject.left / @board.width
      top: @fabricObject.top / @board.height
      path: Path.relativePaths(@fabricObject.path, @board.width, @board.height)
      color: @color
      