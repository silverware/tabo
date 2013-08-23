window.BoardController = class BoardController

  board: null
  toolbar: null
  homeTable: null
  guestTable: null
  editMode: false
  sportType: null

  @homeColor: "#E6E6E6"
  @guestColor: "#000000"

  constructor: (args) ->
    console.debug args.data
    @editMode = args.editMode
    @sportType = args.data?.sportType or args.sportType or "football"
    teamCount = if args.data and not args.data.guestTable then 1 else 2
    @toolbar = new Toolbar(@, teamCount, args.data?.playerLabel or Player.numberLabel)
    @initBoard(args.canvasId, args.data?.board)
    if args.showTables
      Views.buildTableTabs(teamCount)
      @homeTable = new PlayerTable({container: "homeTable", color: BoardController.homeColor, board: @board, editMode: @editMode, tableData: args.data?.homeTable})
      if teamCount is 2
        @guestTable = new PlayerTable({container: "guestTable", color: BoardController.guestColor, board: @board, editMode: @editMode, tableData: args.data?.guestTable})


  initBoard: (canvasId, boardData) ->
    switch @sportType
      when "football" then @board = new FootballBoard(@, canvasId, @editMode, boardData)
      when "volleyball" then @board = new VolleyballBoard(@, canvasId, @editMode, boardData)

  removePlayer: (player) ->
    if player.home then @homeTable.removePlayer player else @guestTable.removePlayer player 

  deleteTeam2: ->
    if @guestTable
      @board.removePitchElement(player) for player in @board.players() when player.home is false
      @guestTable.destroy()
      @guestTable = null
    
  addTeam2: ->
    if not @guestTable
      @board.addPitchElement(value) for key, value of @board.initialGuestPlayerData()
      $("#player_tab").tabs("add", "#guestTable", "Team 2")
      @guestTable = new PlayerTable({container: "guestTable", color: BoardController.guestColor, board: @board, editMode: @editMode})
  
  getCanvasImage: ->
    data = @board.fabricCanvas.toDataURL()
    data[22...data.length]

  load: (data) ->
    @sportType = data.sportType
    
  serialize: ->
    obj = 
      board: @board.serialize()
      homeTable: @homeTable.serialize()
      guestTable: @guestTable?.serialize()
      sportType: @sportType
      playerLabel: @board.playerLabel
    JSON.stringify(obj)