class PlayerArrow extends PitchElement
  
  coords: null
  player: null
  @type: "playerArrow"

  constructor: (@board, @player, args) ->
    super args
    @coords = [player.x * @board.width,
      player.y * @board.height,
      args.stopPoint.x * @board.width
      args.stopPoint.y * @board.height]
    @fabricObject = Arrow.draw(@coords, @color)
    @afterDrawing()
    @accountForEditMode()
    @resizer = []
    @resizer.push(new Resizer(@, @getStop))

  redraw: =>
    if @fabricObject
      @board.remove(@fabricObject)
    @fabricObject = Arrow.draw([@player.x * @board.width, @player.y * @board.height, @resizer[0].fabricRect.left, @resizer[0].fabricRect.top], @color)
    @afterDrawing()

  afterDrawing: () ->
    @fabricObject.lockMovementY = true
    @fabricObject.lockMovementX = true
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
    serialized =
      type: PlayerArrow.type
      stopPoint: 
        x: @getStop().x / @board.width
        y: @getStop().y / @board.height
      color: @color