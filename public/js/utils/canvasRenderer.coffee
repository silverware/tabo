define ->

  paper.install window

  exports =
    init: (canvasId) ->
      canvas = document.getElementById canvasId
      paper.setup canvas
      path = new Path()
      path.strokeColor = 'black'
      start = new Point 100, 100
      path.moveTo start
      path.lineTo start.add([ 200, -50 ])
      view.draw()







