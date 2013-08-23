class PlayerTable

  board: null
  container: null
  color: null
  editMode: false
  table: null

  constructor: (params) ->
    @color = params.color
    @board = params.board
    @editMode = params.editMode
    @container = $("#" + params.container)
    @createPlayerTable(params.tableData)
    @createAddPlayerLink()
    
  createPlayerTable: (data) ->
    @table = $("<table>").attr "class", "playerTable"
    
    if data
      for id in data.rows
        player = (item for item in @board.players() when item.id is id)[0]
        row = @createRow player
        @table.append(row)
    else    
      for player in @board.players() when player.color is @color
        row = @createRow player
        @table.append(row)
        #row.mouseover -> player.highlight(true)
        #row.mouseout -> player.highlight(false)  
    @container.append(@table)
    if @editMode
      for player in @board.players() when player.color is @color
        $("#positionSelect" + player.id).selectmenu()
      @updateTablerDragger()

  createRow: (player) ->
    numberInput = $("<input class='invisible' maxlength='2'>").val(player.number)
    @setInputWidth numberInput
    labelInput = $("<input class='invisible' maxlength='15'>").val(player.label)
    @setInputWidth labelInput
    positionSelect = @createPositionSelect player
      
    if @editMode
      numberInput.editable (number) =>
        player.update
          number: number
      labelInput.editable (name) =>
        player.update
          label: name
    positionTypeCell = $("<td width='10%' class='dragHandle'>").append($("<div id='positionType" + player.id + "' class='positionType' style='background-color:" + @board.positions()[player.position].part + "'>"))
    if not @editMode
      positionTypeCell.removeClass("dragHandle")
    positionCell = $("<td width='35px'>").append(positionSelect)
    labelCell = $("<td>").append(labelInput)
    numberCell = $("<td width='10px'>").append(numberInput)
    row = $("<tr>").append(positionTypeCell, positionCell, labelCell, numberCell).attr("id", player.id)
    
    if @editMode
      deleteIcon = $("<span class='pointer ui-icon ui-icon-circle-close'>").click =>
        row.remove()
        @board.removePitchElement(player)
        
      deleteCell = $("<td width='10px'></td>").append(deleteIcon)
      row.append(deleteCell)
    row

  createAddPlayerLink: ->
    if @editMode
      addIcon = $("<span class='pointer ui-icon ui-icon-circle-plus'>")
      link = $("<a class='addPlayerLink'>Add Player</a>").attr("href", "javascript:").click =>
          @addPlayer()
      link.append addIcon
      @container.append link

  createPositionSelect: (player) =>
    if @editMode
      board = @board
      select = $("<select id='positionSelect" + player.id + "' class='positionSelect'>")
      for key, value of @board.positions()
        option = $("<option>").attr('value', key).text(value.label)
        if key is player.position
          option.attr("selected", true)
        select.append(option)
      select.change ->
        pos = $(this).attr('value')
        player.update({position: pos})
        $("#positionType" + player.id).css("backgroundColor", board.positions()[pos].part)
      select
    else
      $("<label>").append(@board.positions()[player.position].label)

  addPlayer: ->
    player = @board.addPlayer(@color is BoardController.homeColor)
    if player
      @table.append @createRow(player)
      $("#positionSelect" + player.id).selectmenu()
      @updateTablerDragger()
      
  removePlayer: (player) ->
    $("#" + player.id).remove()

  updateTablerDragger: ->
    @table.tableDnD
        onDrop: (table, row) ->
            console.debug(row)
        dragHandle: "dragHandle"

  setInputWidth: (input) ->
    input.css({width: textWidth(input.val()) + WIDTH_OFFSET})
    

  destroy: ->
    $("#player_tab").tabs("remove", 1)

  serialize: ->
    obj =
      rows: @serializeRows()
      
  serializeRows: ->
    rows = []
    for row in @table.find("tr")
      rows.push row.id
    rows