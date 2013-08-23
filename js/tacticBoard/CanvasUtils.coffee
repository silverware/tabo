Array::remove = (e) -> @[t..t] = [] if (t = @indexOf(e)) > -1

class CanvasUtils

  @tempObj =
    startPoint: null
    obj: null

  @getMidPoint: (x1, y1, x2, y2) ->
    xAbs = Math.abs(x1 - x2)
    yAbs = Math.abs(y1 - y2)
    if x1 < x2 then midX = x1 + xAbs/2 else midX = x2 + xAbs/2
    if y1 < y2 then midY = y1 + yAbs/2 else midY = y2 + yAbs/2
    point.x = midX
    point.y = midY
    point

  @getMouseOnCanvas: (e, canvasId) ->
    x = e.memo.e.clientX
    y = e.memo.e.clientY
    point =
      x: x - $("#" + canvasId).offset().left + window.scrollX
      y: y - $("#" + canvasId).offset().top + window.scrollY
      
  @getRelativeCoords: (coords, width, height) ->
    coords = [coords[0] / width, coords[1] / height, coords[2] / width, coords[3] / height]
  
  @getRelativePoints: (points, width, height) ->
    relPoints = []
    for point in points
      relPoints.push
        x: point.x / width
        y: point.y / height
    relPoints

  @getRelativePoint: (point, width, height) ->
    p =
      x: point.x / width
      y: point.y / height

  @getDiagonalLines: (width, height) ->
    interval = 8
    lines = []
    start = 
      x: 5
      y: 0
    stop =
      x: 0
      y: 5
      
    while start.x < width
      start.x += interval
      if stop.y < height
        stop.y += interval
      else
        stop.y = height
        stop.x += interval
      lines.push 
        p1: 
          x: start.x
          y: start.y
        p2:
          x: stop.x
          y: stop.y
    
    start =
      x: width
      y: 0
    
    while start.y < height
      start.y += interval
      if stop.y < height
        stop.y += interval
      else
        stop.y = height
        stop.x += interval
      lines.push 
        p1: 
          x: start.x
          y: start.y
        p2:
          x: stop.x
          y: stop.y
    lines

  @vector: (start, stop) ->
    vector = 
      x: stop.x - start.x
      y: stop.y - start.y

  @rotateVector: (a, phi) ->
    result = 
      x: Math.cos(Math.atan2(a.y, a.x) + phi)
      y: Math.sin(Math.atan2(a.y, a.x) + phi)
      
  @add: (v1, v2) ->
    v = 
      x: v1.x + v2.x
      y: v1.y + v2.y

  @mul: (v1, fac) ->
    v = 
      x: v1.x * fac
      y: v1.y * fac