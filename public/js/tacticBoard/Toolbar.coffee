class Toolbar

  controller: null

  constructor: (controller, teamCount, playerLabel) ->
    @controller = controller
    Views.buildToolbar(teamCount, playerLabel)
    @initToolbar()

  color: ->
    $('#colorSelector').val()
    
  initToolbar: ->
    controller = @controller
    $("#dialog").dialog(
      autoOpen: false
      show: "blind"
      hide: "explode")
    $('#colorSelector').selectmenu(
      style:'dropdown'
      width: '50'
      icons: [
        {find: '.blackColor'}
        {find: '.redColor'}
        {find: '.yellowColor'}
        {find: '.blueColor'}
      ]
    )   
    $("#paint").button
      icons:
        primary: "ui-icon-pencil"
      text: false
      
    $("#paint").click =>
      if $("#drawLine").attr("checked")
        @disableCheckbox $("#drawLine")
        controller.board.disableArrowDrawing()
      if $("#drawRect").attr("checked")
        @disableCheckbox $("#drawRect")
        controller.board.disableRectDrawing()
      if $("#paint").attr("checked") then controller.board.enablePathDrawing() else controller.board.disablePathDrawing()
    
    $("#drawLine").button
      icons:
        primary: "ui-icon-arrowthick-1-se"
      text: false
    $("#drawLine").click =>
      if $("#paint").attr("checked")
        @disableCheckbox $("#paint")
        controller.board.disablePathDrawing()
      if $("#drawRect").attr("checked")
        @disableCheckbox $("#drawRect")
        controller.board.disableRectDrawing()
      if $("#drawLine").attr("checked") then controller.board.enableArrowDrawing() else controller.board.disableArrowDrawing()
    
    $("#drawRect").button
      icons:
        primary: "ui-icon-grip-diagonal-se"
      text: false
    $("#drawRect").click =>
      if $("#paint").attr("checked")
        @disableCheckbox $("#paint")
        controller.board.disablePathDrawing()
      if $("#drawLine").attr("checked")
        @disableCheckbox $("#drawLine")
        controller.board.disableArrowDrawing()
      if $("#drawRect").attr("checked") then controller.board.enableRectDrawing() else controller.board.disableRectDrawing()
		
    $("#teamCount1").button().click(=> @controller.deleteTeam2())
    $("#teamCount2").button().click(=> @controller.addTeam2())
    $("#show_number").button().click( => @controller.board.showNumbers())
    $("#show_position").button().click( => @controller.board.showPositions())
    $("#teamCountChoice").buttonset()
    $("#paintButtons").buttonset()
    $("#labelChoice").buttonset()
    
  disableCheckbox: (checkbox) ->
    checkbox.removeAttr("checked")
    checkbox.button("refresh")