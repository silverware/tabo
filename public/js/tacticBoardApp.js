(function() {
  var Arrow, Board, BoardController, CanvasUtils, DEFENSE, FootballBoard, GOALKEEPER, MIDFIELD, OFFENSE, Path, PitchElement, Plain, Player, PlayerArrow, PlayerTable, Resizer, Toolbar, Views, uniqueId,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  window.BoardController = BoardController = (function() {

    BoardController.prototype.board = null;

    BoardController.prototype.toolbar = null;

    BoardController.prototype.homeTable = null;

    BoardController.prototype.guestTable = null;

    BoardController.prototype.editMode = false;

    BoardController.prototype.sportType = null;

    BoardController.homeColor = "#E6E6E6";

    BoardController.guestColor = "#000000";

    function BoardController(args) {
      var teamCount, _ref, _ref2, _ref3, _ref4, _ref5;
      console.debug(args.data);
      this.editMode = args.editMode;
      this.sportType = ((_ref = args.data) != null ? _ref.sportType : void 0) || args.sportType || "football";
      teamCount = args.data && !args.data.guestTable ? 1 : 2;
      this.toolbar = new Toolbar(this, teamCount, ((_ref2 = args.data) != null ? _ref2.playerLabel : void 0) || Player.numberLabel);
      this.initBoard(args.canvasId, (_ref3 = args.data) != null ? _ref3.board : void 0);
      if (args.showTables) {
        Views.buildTableTabs(teamCount);
        this.homeTable = new PlayerTable({
          container: "homeTable",
          color: BoardController.homeColor,
          board: this.board,
          editMode: this.editMode,
          tableData: (_ref4 = args.data) != null ? _ref4.homeTable : void 0
        });
        if (teamCount === 2) {
          this.guestTable = new PlayerTable({
            container: "guestTable",
            color: BoardController.guestColor,
            board: this.board,
            editMode: this.editMode,
            tableData: (_ref5 = args.data) != null ? _ref5.guestTable : void 0
          });
        }
      }
    }

    BoardController.prototype.initBoard = function(canvasId, boardData) {
      switch (this.sportType) {
        case "football":
          return this.board = new FootballBoard(this, canvasId, this.editMode, boardData);
        case "volleyball":
          return this.board = new VolleyballBoard(this, canvasId, this.editMode, boardData);
      }
    };

    BoardController.prototype.removePlayer = function(player) {
      if (player.home) {
        return this.homeTable.removePlayer(player);
      } else {
        return this.guestTable.removePlayer(player);
      }
    };

    BoardController.prototype.deleteTeam2 = function() {
      var player, _i, _len, _ref;
      if (this.guestTable) {
        _ref = this.board.players();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          if (player.home === false) this.board.removePitchElement(player);
        }
        this.guestTable.destroy();
        return this.guestTable = null;
      }
    };

    BoardController.prototype.addTeam2 = function() {
      var key, value, _ref;
      if (!this.guestTable) {
        _ref = this.board.initialGuestPlayerData();
        for (key in _ref) {
          value = _ref[key];
          this.board.addPitchElement(value);
        }
        $("#player_tab").tabs("add", "#guestTable", "Team 2");
        return this.guestTable = new PlayerTable({
          container: "guestTable",
          color: BoardController.guestColor,
          board: this.board,
          editMode: this.editMode
        });
      }
    };

    BoardController.prototype.getCanvasImage = function() {
      var data;
      data = this.board.fabricCanvas.toDataURL();
      return data.slice(22, data.length);
    };

    BoardController.prototype.load = function(data) {
      return this.sportType = data.sportType;
    };

    BoardController.prototype.serialize = function() {
      var obj, _ref;
      obj = {
        board: this.board.serialize(),
        homeTable: this.homeTable.serialize(),
        guestTable: (_ref = this.guestTable) != null ? _ref.serialize() : void 0,
        sportType: this.sportType,
        playerLabel: this.board.playerLabel
      };
      return JSON.stringify(obj);
    };

    return BoardController;

  })();

  Board = (function() {

    Board.prototype.canvasId = null;

    Board.prototype.fabricCanvas = null;

    Board.prototype.pitchElements = [];

    Board.prototype.width = null;

    Board.prototype.height = null;

    Board.prototype.controller = null;

    Board.prototype.playerLabel = null;

    Board.prototype.editMode = false;

    function Board(controller, canvasId, editMode, data) {
      this.onPathCreated = __bind(this.onPathCreated, this);
      this.onRectMouseUp = __bind(this.onRectMouseUp, this);
      this.onRectMouseMove = __bind(this.onRectMouseMove, this);
      this.onRectMouseDown = __bind(this.onRectMouseDown, this);
      this.onArrowMouseUp = __bind(this.onArrowMouseUp, this);
      this.onArrowMouseMove = __bind(this.onArrowMouseMove, this);
      this.onArrowMouseDown = __bind(this.onArrowMouseDown, this);
      this.isPitchElement = __bind(this.isPitchElement, this);
      this.removePitchElement = __bind(this.removePitchElement, this);      this.playerLabel = (data != null ? data.playerLabel : void 0) || Player.numberLabel;
      this.canvasId = canvasId;
      this.fabricCanvas = new fabric.Canvas(this.canvasId);
      this.width = $("#" + this.canvasId).width();
      this.height = $("#" + this.canvasId).height();
      this.controller = controller;
      this.editMode = editMode;
      this.initCanvas(data != null ? data.pitchElements : void 0);
    }

    Board.prototype.players = function() {
      var item, _i, _len, _ref, _results;
      _ref = this.pitchElements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.type === Player.type) _results.push(item);
      }
      return _results;
    };

    Board.prototype.getTeamSize = function(isHome) {
      var player, size, _i, _len, _ref;
      size = 0;
      _ref = this.players();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.home === isHome) size++;
      }
      return size;
    };

    Board.prototype.add = function(object) {
      this.fabricCanvas.add(object);
      return this.fabricCanvas.renderAll();
    };

    Board.prototype.remove = function(object) {
      var obj, _i, _len, _ref;
      if (!object) return;
      if (object.type === "group") {
        _ref = object.getObjects();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          this.fabricCanvas.remove(obj);
        }
      }
      this.fabricCanvas.remove(object);
      return this.fabricCanvas.renderAll();
    };

    Board.prototype.removePitchElement = function(element) {
      if (!element) return;
      if (element.remove()) return this.pitchElements.remove(element);
    };

    Board.prototype.getPitchElementByFabricObject = function(object) {
      var pitchElement, _i, _len, _ref;
      _ref = this.pitchElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pitchElement = _ref[_i];
        if (pitchElement.fabricObject === object) return pitchElement;
      }
    };

    Board.prototype.addPlayer = function(isHome) {
      var player;
      if (this.getTeamSize(isHome) < this.maxTeamSize) {
        player = this.getNewPlayer();
        player.home = isHome;
        player = this.addPitchElement(player);
      }
      return player;
    };

    Board.prototype.addPitchElement = function(data) {
      var element;
      switch (data.type) {
        case "arrow":
          element = new Arrow(this, data);
          break;
        case "plain":
          element = new Plain(this, data);
          break;
        case "player":
          element = new Player(this, data);
          break;
        case "path":
          element = new Path(this, data);
      }
      this.pitchElements.push(element);
      return element;
    };

    Board.prototype.initCanvas = function(data) {
      var element, imageTarget, key, value, _i, _len, _ref, _ref2;
      if (this.width === 150) {
        imageTarget = 'img/pitch_150.jpg';
      } else {
        imageTarget = 'img/pitch_650.jpg';
      }
      this.fabricCanvas.setBackgroundImage(imageTarget, this.fabricCanvas.renderAll.bind(this.fabricCanvas));
      if (data) {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          element = data[_i];
          this.addPitchElement(element);
        }
      } else {
        _ref = this.initialHomePlayerData();
        for (key in _ref) {
          value = _ref[key];
          this.addPitchElement(value);
        }
        _ref2 = this.initialGuestPlayerData();
        for (key in _ref2) {
          value = _ref2[key];
          this.addPitchElement(value);
        }
      }
      this.fabricCanvas.renderAll.bind(this.fabricCanvas);
      if (this.editMode) {
        this.initDeleteListener();
        return this.initGroupSelectionListener();
      }
    };

    Board.prototype.initDeleteListener = function() {
      var _this = this;
      return document.onkeydown = function(event) {
        var activeObject, player, _i, _len, _ref;
        if (!(event != null)) return;
        if (event.keyCode === 46) {
          activeObject = _this.fabricCanvas.getActiveObject();
          if (activeObject) {
            _ref = _this.players();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              player = _ref[_i];
              player.removeSelectedArrow(activeObject);
            }
            return _this.removePitchElement(_this.getPitchElementByFabricObject(activeObject));
          }
        }
      };
    };

    Board.prototype.initGroupSelectionListener = function() {
      var _this = this;
      return this.fabricCanvas.observe("selection:created", function(event) {
        var group;
        group = event.memo.target;
        if (!_this.isPitchElement(group)) return group.hasControls = false;
      });
    };

    Board.prototype.isPitchElement = function(group) {
      var element, _i, _len, _ref;
      _ref = this.pitchElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (element.fabricObject === group) return element;
      }
      return false;
    };

    Board.prototype.updateCanvas = function() {
      return this.fabricCanvas.renderAll();
    };

    Board.prototype.showNumbers = function() {
      var player, _i, _len, _ref, _results;
      this.playerLabel = Player.numberLabel;
      _ref = this.players();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        _results.push(player.showNumber());
      }
      return _results;
    };

    Board.prototype.showPositions = function() {
      var player, _i, _len, _ref, _results;
      this.playerLabel = Player.positionLabel;
      _ref = this.players();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        _results.push(player.showPosition());
      }
      return _results;
    };

    Board.prototype.serializePitchElements = function() {
      var pitchElement, pitchElements, _i, _len, _ref;
      pitchElements = [];
      _ref = this.pitchElements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pitchElement = _ref[_i];
        pitchElements.push(pitchElement.serialize());
      }
      return pitchElements;
    };

    Board.prototype.serialize = function() {
      var obj;
      return obj = {
        pitchElements: this.serializePitchElements(),
        playerLabel: this.playerLabel
      };
    };

    Board.prototype.load = function(data) {
      var pitchElementData, _i, _len, _ref, _results;
      this.setSettings(data.settings);
      _ref = data.pitchElements;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pitchElementData = _ref[_i];
        _results.push(this.pitchElements.push(PitchElement.create(pitchElementData)));
      }
      return _results;
    };

    Board.prototype.enableSelectableItems = function(bool) {
      var object, _i, _len, _ref, _results;
      _ref = this.fabricCanvas.getObjects();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        object = _ref[_i];
        _results.push(object.selectable = bool);
      }
      return _results;
    };

    Board.prototype.enableArrowDrawing = function() {
      console.debug("arrow Drawing");
      this.enableSelectableItems(false);
      this.fabricCanvas.observe('mouse:down', this.onArrowMouseDown);
      this.fabricCanvas.observe('mouse:move', this.onArrowMouseMove);
      return this.fabricCanvas.observe('mouse:up', this.onArrowMouseUp);
    };

    Board.prototype.disableArrowDrawing = function() {
      this.enableSelectableItems(true);
      this.fabricCanvas.stopObserving('mouse:up', this.onArrowMouseUp);
      this.fabricCanvas.stopObserving('mouse:move', this.onArrowMouseMove);
      return this.fabricCanvas.stopObserving('mouse:down', this.onArrowMouseDown);
    };

    Board.prototype.onArrowMouseDown = function(e) {
      return CanvasUtils.tempObj.startPoint = CanvasUtils.getMouseOnCanvas(e, this.canvasId);
    };

    Board.prototype.onArrowMouseMove = function(e) {
      var arrow, coords, point;
      if (CanvasUtils.tempObj.obj !== null) this.remove(CanvasUtils.tempObj.obj);
      point = CanvasUtils.getMouseOnCanvas(e, this.canvasId);
      if (CanvasUtils.tempObj.startPoint !== null) {
        coords = [CanvasUtils.tempObj.startPoint.x, CanvasUtils.tempObj.startPoint.y, point.x, point.y];
        arrow = Arrow.draw(coords, this.controller.toolbar.color());
        this.fabricCanvas.add(arrow);
        this.fabricCanvas.sendToBack(arrow);
        return CanvasUtils.tempObj.obj = arrow;
      }
    };

    Board.prototype.onArrowMouseUp = function(e) {
      var coords, player, playerArrow, startPoint, stopPoint, _i, _len, _ref;
      if (CanvasUtils.tempObj.obj !== null) {
        stopPoint = CanvasUtils.getMouseOnCanvas(e, this.canvasId);
        startPoint = CanvasUtils.tempObj.startPoint;
        coords = [startPoint.x, startPoint.y, stopPoint.x, stopPoint.y];
        this.remove(CanvasUtils.tempObj.obj);
        playerArrow = false;
        _ref = this.players();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          player = _ref[_i];
          if (!(player.contains({
            x: startPoint.x,
            y: startPoint.y
          }))) {
            continue;
          }
          player.addArrow({
            stopPoint: CanvasUtils.getRelativePoint(stopPoint, this.width, this.height),
            color: this.controller.toolbar.color()
          });
          playerArrow = true;
          break;
        }
        if (!playerArrow) {
          this.pitchElements.push(new Arrow(this, {
            coords: CanvasUtils.getRelativeCoords(coords, this.width, this.height),
            color: this.controller.toolbar.color()
          }));
        }
      }
      return CanvasUtils.tempObj = {
        obj: null,
        startPoint: null
      };
    };

    Board.prototype.enableRectDrawing = function() {
      this.enableSelectableItems(false);
      this.fabricCanvas.observe('mouse:down', this.onRectMouseDown);
      this.fabricCanvas.observe('mouse:move', this.onRectMouseMove);
      return this.fabricCanvas.observe('mouse:up', this.onRectMouseUp);
    };

    Board.prototype.disableRectDrawing = function() {
      this.enableSelectableItems(true);
      this.fabricCanvas.stopObserving('mouse:up', this.onRectMouseUp);
      this.fabricCanvas.stopObserving('mouse:move', this.onRectMouseMove);
      return this.fabricCanvas.stopObserving('mouse:down', this.onRectMouseDown);
    };

    Board.prototype.onRectMouseDown = function(e) {
      return CanvasUtils.tempObj.startPoint = CanvasUtils.getMouseOnCanvas(e, this.canvasId);
    };

    Board.prototype.onRectMouseMove = function(e) {
      var point2, point3, rect, startPoint, stopPoint;
      if (CanvasUtils.tempObj.obj !== null) this.remove(CanvasUtils.tempObj.obj);
      if (CanvasUtils.tempObj.startPoint !== null) {
        startPoint = CanvasUtils.tempObj.startPoint;
        stopPoint = CanvasUtils.getMouseOnCanvas(e, this.canvasId);
        point2 = {
          x: startPoint.x,
          y: stopPoint.y
        };
        point3 = {
          x: stopPoint.x,
          y: startPoint.y
        };
        rect = Plain.draw([startPoint, point2, stopPoint, point3], this.width, this.height, this.controller.toolbar.color());
        this.add(rect);
        return CanvasUtils.tempObj.obj = rect;
      }
    };

    Board.prototype.onRectMouseUp = function(e) {
      var point2, point3, startPoint, stopPoint;
      if (CanvasUtils.tempObj.obj !== null) {
        stopPoint = CanvasUtils.getMouseOnCanvas(e, this.canvasId);
        startPoint = CanvasUtils.tempObj.startPoint;
        point2 = {
          x: startPoint.x,
          y: stopPoint.y
        };
        point3 = {
          x: stopPoint.x,
          y: startPoint.y
        };
        this.remove(CanvasUtils.tempObj.obj);
        this.pitchElements.push(new Plain(this, {
          points: CanvasUtils.getRelativePoints([startPoint, point2, stopPoint, point3], this.width, this.height),
          width: this.width,
          height: this.height,
          color: this.controller.toolbar.color()
        }));
      }
      return CanvasUtils.tempObj = {
        obj: null,
        startPoint: null
      };
    };

    Board.prototype.enablePathDrawing = function() {
      this.enableSelectableItems(false);
      this.fabricCanvas.isDrawingMode = true;
      this.fabricCanvas.freeDrawingLineWidth = 3;
      this.fabricCanvas.freeDrawingColor = this.controller.toolbar.color();
      document.body.style.cursor = "pointer";
      return this.fabricCanvas.observe('path:created', this.onPathCreated);
    };

    Board.prototype.disablePathDrawing = function() {
      this.enableSelectableItems(true);
      this.fabricCanvas.isDrawingMode = false;
      document.body.style.cursor = "default";
      return this.fabricCanvas.stopObserving('path:created', this.onPathCreated);
    };

    Board.prototype.onPathCreated = function(e) {
      var path;
      console.debug(e);
      path = e.memo.path;
      this.remove(path);
      return this.pitchElements.push(new Path(this, {
        path: Path.relativePaths(path.path, this.width, this.height),
        width: path.width / this.width,
        height: path.height / this.height,
        left: path.left / this.width,
        top: path.top / this.height,
        color: this.controller.toolbar.color()
      }));
    };

    return Board;

  })();

  DEFENSE = "#DBF208";

  MIDFIELD = "#17DF10";

  OFFENSE = "#3A53DC";

  GOALKEEPER = "#E27100";

  FootballBoard = (function(_super) {

    __extends(FootballBoard, _super);

    function FootballBoard() {
      FootballBoard.__super__.constructor.apply(this, arguments);
    }

    FootballBoard.positions = {
      TW: {
        label: "GK",
        part: GOALKEEPER
      },
      IV: {
        label: "CB",
        part: DEFENSE
      },
      RV: {
        label: "RB",
        part: DEFENSE
      },
      RAV: {
        label: "RWB",
        part: DEFENSE
      },
      LV: {
        label: "LB",
        part: DEFENSE
      },
      LAV: {
        label: "LWB",
        part: DEFENSE
      },
      ZDM: {
        label: "CDM",
        part: MIDFIELD
      },
      ZM: {
        label: "CM",
        part: MIDFIELD
      },
      ZOM: {
        label: "CAM",
        part: MIDFIELD
      },
      RM: {
        label: "RM",
        part: MIDFIELD
      },
      LM: {
        label: "LM",
        part: MIDFIELD
      },
      LS: {
        label: "LF",
        part: OFFENSE
      },
      RS: {
        label: "RF",
        part: OFFENSE
      },
      ST: {
        label: "ST",
        part: OFFENSE
      }
    };

    FootballBoard.initialHomePlayerData = {
      1: {
        type: "player",
        id: "1",
        x: 0.04,
        y: 0.5,
        label: "Player 1",
        number: "1",
        home: true,
        position: "TW"
      },
      2: {
        type: "player",
        id: "2",
        x: 0.16,
        y: 0.2,
        label: "Player 2",
        number: "2",
        home: true,
        position: "LV"
      },
      3: {
        type: "player",
        id: "3",
        x: 0.16,
        y: 0.4,
        label: "Player 3",
        number: "3",
        home: true,
        position: "IV"
      },
      4: {
        type: "player",
        id: "4",
        x: 0.16,
        y: 0.6,
        label: "Player 4",
        number: "4",
        home: true,
        position: "IV"
      },
      5: {
        type: "player",
        id: "5",
        x: 0.16,
        y: 0.8,
        label: "Player 5",
        number: "5",
        home: true,
        position: "RV"
      },
      6: {
        type: "player",
        id: "6",
        x: 0.3,
        y: 0.2,
        label: "Player 6",
        number: "6",
        home: true,
        position: "LM"
      },
      7: {
        type: "player",
        id: "7",
        x: 0.3,
        y: 0.4,
        label: "Player 7",
        number: "7",
        home: true,
        position: "ZM"
      },
      8: {
        type: "player",
        id: "8",
        x: 0.3,
        y: 0.6,
        label: "Player 8",
        number: "8",
        home: true,
        position: "ZM"
      },
      9: {
        type: "player",
        id: "9",
        x: 0.3,
        y: 0.8,
        label: "Player 9",
        number: "9",
        home: true,
        position: "RM"
      },
      10: {
        type: "player",
        id: "10",
        x: 0.45,
        y: 0.4,
        label: "Player 10",
        number: "10",
        home: true,
        position: "ST"
      },
      11: {
        type: "player",
        id: "11",
        x: 0.45,
        y: 0.6,
        label: "Player 11",
        number: "11",
        home: true,
        position: "ST"
      }
    };

    FootballBoard.initialGuestPlayerData = {
      12: {
        type: "player",
        id: "12",
        x: 0.96,
        y: 0.5,
        label: "Player 1",
        number: "1",
        home: false,
        position: "TW"
      },
      13: {
        type: "player",
        id: "13",
        x: 0.84,
        y: 0.2,
        label: "Player 2",
        number: "2",
        home: false,
        position: "RV"
      },
      14: {
        type: "player",
        id: "14",
        x: 0.84,
        y: 0.4,
        label: "Player 3",
        number: "3",
        home: false,
        position: "IV"
      },
      15: {
        type: "player",
        id: "15",
        x: 0.84,
        y: 0.6,
        label: "Player 4",
        number: "4",
        home: false,
        position: "IV"
      },
      16: {
        type: "player",
        id: "16",
        x: 0.84,
        y: 0.8,
        label: "Player 5",
        number: "5",
        home: false,
        position: "LV"
      },
      17: {
        type: "player",
        id: "17",
        x: 0.7,
        y: 0.2,
        label: "Player 6",
        number: "6",
        home: false,
        position: "RM"
      },
      18: {
        type: "player",
        id: "18",
        x: 0.7,
        y: 0.4,
        label: "Player 7",
        number: "7",
        home: false,
        position: "ZM"
      },
      19: {
        type: "player",
        id: "19",
        x: 0.7,
        y: 0.6,
        label: "Player 8",
        number: "8",
        home: false,
        position: "ZM"
      },
      20: {
        type: "player",
        id: "20",
        x: 0.7,
        y: 0.8,
        label: "Player 9",
        number: "9",
        home: false,
        position: "LM"
      },
      21: {
        type: "player",
        id: "21",
        x: 0.55,
        y: 0.4,
        label: "Player 10",
        number: "10",
        home: false,
        position: "ST"
      },
      22: {
        type: "player",
        id: "22",
        x: 0.55,
        y: 0.6,
        label: "Player 11",
        number: "11",
        home: false,
        position: "ST"
      }
    };

    FootballBoard.prototype.maxTeamSize = 11;

    FootballBoard.prototype.getNewPlayer = function() {
      var player;
      return player = {
        type: "player",
        id: uniqueId(),
        x: 0.5,
        y: 0.5,
        label: "Player",
        number: "11",
        position: "ST"
      };
    };

    FootballBoard.prototype.initialHomePlayerData = function() {
      return FootballBoard.initialHomePlayerData;
    };

    FootballBoard.prototype.initialGuestPlayerData = function() {
      return FootballBoard.initialGuestPlayerData;
    };

    FootballBoard.prototype.positions = function() {
      return FootballBoard.positions;
    };

    return FootballBoard;

  })(Board);

  PitchElement = (function() {

    PitchElement.prototype.board = null;

    PitchElement.prototype.color = null;

    PitchElement.prototype.fabricObject = null;

    PitchElement.prototype.resizer = null;

    PitchElement.reverseColor = function(color) {
      if (color === BoardController.guestColor) {
        return BoardController.homeColor;
      } else {
        return BoardController.guestColor;
      }
    };

    PitchElement.isPlayer = function(object) {
      return object.type === 'group' && object.objects[0].type === 'circle';
    };

    function PitchElement(params) {
      this.remove = __bind(this.remove, this);
      this.isPart = __bind(this.isPart, this);
      this.deselected = __bind(this.deselected, this);
      this.moved = __bind(this.moved, this);
      this.deselectionListener = __bind(this.deselectionListener, this);
      this.moveListener = __bind(this.moveListener, this);
      this.selectionListener = __bind(this.selectionListener, this);      this.color = params.color || "black";
      if (this.board.editMode) this.initObserver();
    }

    PitchElement.prototype.accountForEditMode = function() {
      return this.fabricObject.selectable = this.board.editMode;
    };

    PitchElement.prototype.initObserver = function() {
      return this.board.fabricCanvas.observe({
        'object:selected': this.selectionListener,
        'object:moving': this.moveListener,
        'before:selection:cleared': this.deselectionListener
      });
    };

    PitchElement.prototype.selectionListener = function(e) {
      var r, _i, _len, _ref;
      if (this.resizer) {
        if (e.memo.target === this.fabricObject) {
          _ref = this.resizer;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            r = _ref[_i];
            r.show();
          }
        } else if (!this.isPart(e.memo.target)) {
          this.deselected();
        }
      }
      if (this.isPart(e.memo.target)) return this.fabricObject.set("opacity", 0.6);
    };

    PitchElement.prototype.moveListener = function(e) {
      if (e.memo.target === this.fabricObject) return this.moved();
    };

    PitchElement.prototype.deselectionListener = function(e) {
      if (e.memo.target === this.fabricObject) return this.deselected();
    };

    PitchElement.prototype.moved = function() {
      var r, _i, _len, _ref, _results;
      if (this.resizer) {
        _ref = this.resizer;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          r = _ref[_i];
          _results.push(r.update());
        }
        return _results;
      }
    };

    PitchElement.prototype.deselected = function() {
      var r, _i, _len, _ref, _results;
      this.fabricObject.set("opacity", 1);
      if (this.resizer) {
        _ref = this.resizer;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          r = _ref[_i];
          _results.push(r.remove());
        }
        return _results;
      }
    };

    PitchElement.prototype.isPart = function(element) {
      var isPart, resizer, _i, _len, _ref;
      isPart = false;
      if (this.fabricObject === element) isPart = true;
      if (!(this.resizer != null)) return isPart;
      _ref = this.resizer;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resizer = _ref[_i];
        if (resizer.fabricRect === element) isPart = true;
      }
      return isPart;
    };

    PitchElement.prototype.removeResizer = function(index) {
      if (this.resizer[index]) {
        this.resizer[index].remove();
        return this.resizer.remove(this.resizer[index]);
      }
    };

    PitchElement.prototype.remove = function() {
      var obj, resizer, _i, _j, _len, _len2, _ref, _ref2;
      this.board.fabricCanvas.stopObserving({
        'object:selected': this.selectionListener,
        'object:moving': this.moveListener,
        'before:selection:cleared': this.deselectionListener
      });
      console.debug(this.fabricObject);
      if (this.fabricObject.type === "group") {
        _ref = this.fabricObject.getObjects();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          this.board.remove(obj);
        }
      }
      if (this.resizer) {
        _ref2 = this.resizer;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          resizer = _ref2[_j];
          resizer.remove();
        }
      }
      this.board.remove(this.fabricObject);
      return true;
    };

    return PitchElement;

  })();

  Resizer = (function() {

    Resizer.prototype.element = null;

    Resizer.prototype.fabricRect = null;

    Resizer.prototype.getCorner = null;

    function Resizer(pitchElement, getCorner) {
      this.deselected = __bind(this.deselected, this);
      this.moving = __bind(this.moving, this);      this.element = pitchElement;
      this.getCorner = getCorner;
      this.element.board.fabricCanvas.observe({
        'object:moving': this.moving,
        'before:selection:cleared': this.deselected
      });
    }

    Resizer.prototype.moving = function(e) {
      if (e.memo.target === this.fabricRect) {
        this.element.redraw();
        return this.element.board.fabricCanvas.bringForward(this.fabricRect);
      }
    };

    Resizer.prototype.deselected = function(e) {
      if (e.memo.target = this.fabricRect) return this.element.deselected();
    };

    Resizer.prototype.show = function() {
      console.debug(this.element);
      if (this.fabricRect === null) {
        this.fabricRect = this.create();
        return this.element.board.add(this.fabricRect);
      }
    };

    Resizer.prototype.remove = function() {
      this.element.board.remove(this.fabricRect);
      return this.fabricRect = null;
    };

    Resizer.prototype.update = function() {
      this.fabricRect.left = this.getCorner().x;
      return this.fabricRect.top = this.getCorner().y;
    };

    Resizer.prototype.create = function() {
      var resizer;
      resizer = new fabric.Rect({
        width: 12,
        height: 12,
        left: this.getCorner().x,
        top: this.getCorner().y,
        fill: '#5C9CCC',
        opacity: 0.85
      });
      resizer.selectable = true;
      resizer.hasBorders = resizer.hasControls = false;
      return resizer;
    };

    Resizer.prototype.getPoint = function() {
      var point;
      return point = {
        x: this.fabricRect.left,
        y: this.fabricRect.top
      };
    };

    return Resizer;

  })();

  PlayerTable = (function() {

    PlayerTable.prototype.board = null;

    PlayerTable.prototype.container = null;

    PlayerTable.prototype.color = null;

    PlayerTable.prototype.editMode = false;

    PlayerTable.prototype.table = null;

    function PlayerTable(params) {
      this.createPositionSelect = __bind(this.createPositionSelect, this);      this.color = params.color;
      this.board = params.board;
      this.editMode = params.editMode;
      this.container = $("#" + params.container);
      this.createPlayerTable(params.tableData);
      this.createAddPlayerLink();
    }

    PlayerTable.prototype.createPlayerTable = function(data) {
      var id, item, player, row, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      this.table = $("<table>").attr("class", "playerTable");
      if (data) {
        _ref = data.rows;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          id = _ref[_i];
          player = ((function() {
            var _j, _len2, _ref2, _results;
            _ref2 = this.board.players();
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              item = _ref2[_j];
              if (item.id === id) _results.push(item);
            }
            return _results;
          }).call(this))[0];
          row = this.createRow(player);
          this.table.append(row);
        }
      } else {
        _ref2 = this.board.players();
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          player = _ref2[_j];
          if (!(player.color === this.color)) continue;
          row = this.createRow(player);
          this.table.append(row);
        }
      }
      this.container.append(this.table);
      if (this.editMode) {
        _ref3 = this.board.players();
        for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
          player = _ref3[_k];
          if (player.color === this.color) {
            $("#positionSelect" + player.id).selectmenu();
          }
        }
        return this.updateTablerDragger();
      }
    };

    PlayerTable.prototype.createRow = function(player) {
      var deleteCell, deleteIcon, labelCell, labelInput, numberCell, numberInput, positionCell, positionSelect, positionTypeCell, row,
        _this = this;
      numberInput = $("<input class='invisible' maxlength='2'>").val(player.number);
      this.setInputWidth(numberInput);
      labelInput = $("<input class='invisible' maxlength='15'>").val(player.label);
      this.setInputWidth(labelInput);
      positionSelect = this.createPositionSelect(player);
      if (this.editMode) {
        numberInput.editable(function(number) {
          return player.update({
            number: number
          });
        });
        labelInput.editable(function(name) {
          return player.update({
            label: name
          });
        });
      }
      positionTypeCell = $("<td width='10%' class='dragHandle'>").append($("<div id='positionType" + player.id + "' class='positionType' style='background-color:" + this.board.positions()[player.position].part + "'>"));
      if (!this.editMode) positionTypeCell.removeClass("dragHandle");
      positionCell = $("<td width='35px'>").append(positionSelect);
      labelCell = $("<td>").append(labelInput);
      numberCell = $("<td width='10px'>").append(numberInput);
      row = $("<tr>").append(positionTypeCell, positionCell, labelCell, numberCell).attr("id", player.id);
      if (this.editMode) {
        deleteIcon = $("<span class='pointer ui-icon ui-icon-circle-close'>").click(function() {
          row.remove();
          return _this.board.removePitchElement(player);
        });
        deleteCell = $("<td width='10px'></td>").append(deleteIcon);
        row.append(deleteCell);
      }
      return row;
    };

    PlayerTable.prototype.createAddPlayerLink = function() {
      var addIcon, link,
        _this = this;
      if (this.editMode) {
        addIcon = $("<span class='pointer ui-icon ui-icon-circle-plus'>");
        link = $("<a class='addPlayerLink'>Add Player</a>").attr("href", "javascript:").click(function() {
          return _this.addPlayer();
        });
        link.append(addIcon);
        return this.container.append(link);
      }
    };

    PlayerTable.prototype.createPositionSelect = function(player) {
      var board, key, option, select, value, _ref;
      if (this.editMode) {
        board = this.board;
        select = $("<select id='positionSelect" + player.id + "' class='positionSelect'>");
        _ref = this.board.positions();
        for (key in _ref) {
          value = _ref[key];
          option = $("<option>").attr('value', key).text(value.label);
          if (key === player.position) option.attr("selected", true);
          select.append(option);
        }
        select.change(function() {
          var pos;
          pos = $(this).attr('value');
          player.update({
            position: pos
          });
          return $("#positionType" + player.id).css("backgroundColor", board.positions()[pos].part);
        });
        return select;
      } else {
        return $("<label>").append(this.board.positions()[player.position].label);
      }
    };

    PlayerTable.prototype.addPlayer = function() {
      var player;
      player = this.board.addPlayer(this.color === BoardController.homeColor);
      if (player) {
        this.table.append(this.createRow(player));
        $("#positionSelect" + player.id).selectmenu();
        return this.updateTablerDragger();
      }
    };

    PlayerTable.prototype.removePlayer = function(player) {
      return $("#" + player.id).remove();
    };

    PlayerTable.prototype.updateTablerDragger = function() {
      return this.table.tableDnD({
        onDrop: function(table, row) {
          return console.debug(row);
        },
        dragHandle: "dragHandle"
      });
    };

    PlayerTable.prototype.setInputWidth = function(input) {
      return input.css({
        width: textWidth(input.val()) + WIDTH_OFFSET
      });
    };

    PlayerTable.prototype.destroy = function() {
      return $("#player_tab").tabs("remove", 1);
    };

    PlayerTable.prototype.serialize = function() {
      var obj;
      return obj = {
        rows: this.serializeRows()
      };
    };

    PlayerTable.prototype.serializeRows = function() {
      var row, rows, _i, _len, _ref;
      rows = [];
      _ref = this.table.find("tr");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        rows.push(row.id);
      }
      return rows;
    };

    return PlayerTable;

  })();

  Toolbar = (function() {

    Toolbar.prototype.controller = null;

    function Toolbar(controller, teamCount, playerLabel) {
      this.controller = controller;
      Views.buildToolbar(teamCount, playerLabel);
      this.initToolbar();
    }

    Toolbar.prototype.color = function() {
      return $('#colorSelector').val();
    };

    Toolbar.prototype.initToolbar = function() {
      var controller,
        _this = this;
      controller = this.controller;
      $("#dialog").dialog({
        autoOpen: false,
        show: "blind",
        hide: "explode"
      });
      $('#colorSelector').selectmenu({
        style: 'dropdown',
        width: '50',
        icons: [
          {
            find: '.blackColor'
          }, {
            find: '.redColor'
          }, {
            find: '.yellowColor'
          }, {
            find: '.blueColor'
          }
        ]
      });
      $("#paint").button({
        icons: {
          primary: "ui-icon-pencil"
        },
        text: false
      });
      $("#paint").click(function() {
        if ($("#drawLine").attr("checked")) {
          _this.disableCheckbox($("#drawLine"));
          controller.board.disableArrowDrawing();
        }
        if ($("#drawRect").attr("checked")) {
          _this.disableCheckbox($("#drawRect"));
          controller.board.disableRectDrawing();
        }
        if ($("#paint").attr("checked")) {
          return controller.board.enablePathDrawing();
        } else {
          return controller.board.disablePathDrawing();
        }
      });
      $("#drawLine").button({
        icons: {
          primary: "ui-icon-arrowthick-1-se"
        },
        text: false
      });
      $("#drawLine").click(function() {
        if ($("#paint").attr("checked")) {
          _this.disableCheckbox($("#paint"));
          controller.board.disablePathDrawing();
        }
        if ($("#drawRect").attr("checked")) {
          _this.disableCheckbox($("#drawRect"));
          controller.board.disableRectDrawing();
        }
        if ($("#drawLine").attr("checked")) {
          return controller.board.enableArrowDrawing();
        } else {
          return controller.board.disableArrowDrawing();
        }
      });
      $("#drawRect").button({
        icons: {
          primary: "ui-icon-grip-diagonal-se"
        },
        text: false
      });
      $("#drawRect").click(function() {
        if ($("#paint").attr("checked")) {
          _this.disableCheckbox($("#paint"));
          controller.board.disablePathDrawing();
        }
        if ($("#drawLine").attr("checked")) {
          _this.disableCheckbox($("#drawLine"));
          controller.board.disableArrowDrawing();
        }
        if ($("#drawRect").attr("checked")) {
          return controller.board.enableRectDrawing();
        } else {
          return controller.board.disableRectDrawing();
        }
      });
      $("#teamCount1").button().click(function() {
        return _this.controller.deleteTeam2();
      });
      $("#teamCount2").button().click(function() {
        return _this.controller.addTeam2();
      });
      $("#show_number").button().click(function() {
        return _this.controller.board.showNumbers();
      });
      $("#show_position").button().click(function() {
        return _this.controller.board.showPositions();
      });
      $("#teamCountChoice").buttonset();
      $("#paintButtons").buttonset();
      return $("#labelChoice").buttonset();
    };

    Toolbar.prototype.disableCheckbox = function(checkbox) {
      checkbox.removeAttr("checked");
      return checkbox.button("refresh");
    };

    return Toolbar;

  })();

  uniqueId = function(length) {
    var id;
    if (length == null) length = 8;
    id = "";
    while (id.length < length) {
      id += Math.random().toString(36).substr(2);
    }
    return id.substr(0, length);
  };

  Player = (function(_super) {

    __extends(Player, _super);

    Player.prototype.id = null;

    Player.prototype.label = null;

    Player.prototype.x = null;

    Player.prototype.y = null;

    Player.prototype.position = null;

    Player.prototype.number = null;

    Player.prototype.home = null;

    Player.radius = 0.019;

    Player.innerRadius = 0.015;

    Player.fontSize = 0.019;

    Player.type = "player";

    Player.numberLabel = "number";

    Player.positionLabel = "position";

    function Player(board, args) {
      var key, val;
      this.board = board;
      this.onMove = __bind(this.onMove, this);
      for (key in args) {
        val = args[key];
        this[key] = val;
      }
      this.arrows = [];
      this.color = this.home ? BoardController.homeColor : BoardController.guestColor;
      this.type = Player.type;
      this.draw();
      if (args.arrows) this.drawArrows(args.arrows);
      this.accountForEditMode();
      this.initObserver();
    }

    Player.prototype.draw = function() {
      var group, innerCircle, outerCircle, overlay, text;
      console.debug("draw Player: " + this.label);
      outerCircle = new fabric.Circle({
        radius: this.board.width * Player.radius,
        left: this.x * this.board.width,
        top: this.y * this.board.height,
        fill: this.position["part"],
        opacity: 1
      });
      overlay = new fabric.Circle({
        radius: this.board.width * Player.radius,
        left: this.x * this.board.width,
        top: this.y * this.board.height,
        opacity: 0
      });
      innerCircle = new fabric.Circle({
        radius: this.board.width * Player.innerRadius,
        left: this.x * this.board.width,
        top: this.y * this.board.height,
        fill: this.color,
        opacity: 1
      });
      text = new fabric.Text(this.number, {
        fontFamily: 'CrashCTT_400',
        left: this.x * this.board.width,
        top: this.y * this.board.height,
        fontSize: Player.fontSize * this.board.width,
        textAlign: "center",
        fill: PitchElement.reverseColor(this.color)
      });
      group = new fabric.Group();
      group.add(outerCircle);
      group.add(innerCircle);
      group.add(text);
      group.add(overlay);
      outerCircle.hasControls = outerCircle.hasBorders = false;
      innerCircle.hasControls = innerCircle.hasBorders = false;
      text.hasControls = text.hasBorders = false;
      overlay.hasControls = overlay.hasBorders = false;
      group.hasControls = group.hasBorders = false;
      this.fabricObject = group;
      this.updatePlayerLabel();
      return this.board.add(group);
    };

    Player.prototype.drawArrows = function(arrowData) {
      var data, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arrowData.length; _i < _len; _i++) {
        data = arrowData[_i];
        _results.push(this.addArrow(data));
      }
      return _results;
    };

    Player.prototype.initObserver = function() {
      return this.board.fabricCanvas.observe({
        'object:moving': this.onMove
      });
    };

    Player.prototype.onMove = function(e) {
      var arrow, x, y, _i, _len, _ref, _results;
      if (e.memo.target === this.fabricObject || (e.memo.target.type === "group" && e.memo.target.contains(this.fabricObject))) {
        this.updatePosition();
        _ref = this.arrows;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arrow = _ref[_i];
          x = this.fabricObject.left - arrow.getStart().x;
          y = this.fabricObject.top - arrow.getStart().y;
          arrow.fabricObject.left += x;
          _results.push(arrow.fabricObject.top += y);
        }
        return _results;
      }
    };

    Player.prototype.addArrow = function(arrowParams) {
      var arrow;
      this.updatePosition();
      arrow = new PlayerArrow(this.board, this, arrowParams);
      return this.arrows.push(arrow);
    };

    Player.prototype.contains = function(point) {
      return this.fabricObject.containsPoint(point);
    };

    Player.prototype.highlight = function(highlight) {
      console.debug(highlight);
      this.fabricObject.item(1).setOpacity(highlight ? 0.6 : 0.95);
      return this.board.updateCanvas();
    };

    Player.prototype.showNumber = function() {
      this.fabricObject.item(2).setText(this.number);
      return this.board.updateCanvas();
    };

    Player.prototype.showPosition = function() {
      this.fabricObject.item(2).setText(this.board.positions()[this.position].label + "");
      return this.board.updateCanvas();
    };

    Player.prototype.updatePlayerLabel = function() {
      if (this.board.playerLabel === Player.numberLabel) {
        this.showNumber();
      } else if (this.board.playerLabel === Player.positionLabel) {
        this.showPosition();
      }
      this.fabricObject.item(0).setFill(this.board.positions()[this.position].part);
      return this.board.updateCanvas();
    };

    Player.prototype.update = function(params) {
      if (params.position) this.position = params.position;
      if (params.label) this.label = params.label;
      if (params.number) this.number = params.number;
      return this.updatePlayerLabel();
    };

    Player.prototype.removeSelectedArrow = function(fabricObject) {
      var arrow, toRemove, _i, _j, _len, _len2, _ref, _results;
      toRemove = [];
      _ref = this.arrows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        arrow = _ref[_i];
        if (!(arrow.fabricObject === fabricObject)) continue;
        arrow.remove();
        toRemove.push(arrow);
      }
      _results = [];
      for (_j = 0, _len2 = toRemove.length; _j < _len2; _j++) {
        arrow = toRemove[_j];
        _results.push(this.arrows.remove(arrow));
      }
      return _results;
    };

    Player.prototype.remove = function() {
      var arrow, _i, _len, _ref;
      this.board.fabricCanvas.stopObserving({
        'object:moving': this.onMove
      });
      _ref = this.arrows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        arrow = _ref[_i];
        arrow.remove();
      }
      this.board.controller.removePlayer(this);
      return Player.__super__.remove.call(this);
    };

    Player.prototype.serialize = function() {
      var arrow, arrows, obj, _i, _len, _ref;
      this.updatePosition();
      arrows = [];
      _ref = this.arrows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        arrow = _ref[_i];
        arrows.push(arrow.serialize());
      }
      return obj = {
        type: Player.type,
        id: this.id,
        x: this.x,
        y: this.y,
        label: this.label,
        number: this.number,
        home: this.home,
        position: this.position,
        arrows: arrows
      };
    };

    Player.prototype.updatePosition = function() {
      var radius;
      radius = this.fabricObject.item(0).radius;
      this.x = (this.fabricObject.getCenter().x - radius) / this.board.width;
      return this.y = (this.fabricObject.getCenter().y - radius) / this.board.height;
    };

    return Player;

  })(PitchElement);

  PlayerArrow = (function(_super) {

    __extends(PlayerArrow, _super);

    PlayerArrow.prototype.coords = null;

    PlayerArrow.prototype.player = null;

    PlayerArrow.type = "playerArrow";

    function PlayerArrow(board, player, args) {
      this.board = board;
      this.player = player;
      this.getStop = __bind(this.getStop, this);
      this.getStart = __bind(this.getStart, this);
      this.redraw = __bind(this.redraw, this);
      PlayerArrow.__super__.constructor.call(this, args);
      this.coords = [player.x * this.board.width, player.y * this.board.height, args.stopPoint.x * this.board.width, args.stopPoint.y * this.board.height];
      this.fabricObject = Arrow.draw(this.coords, this.color);
      this.afterDrawing();
      this.accountForEditMode();
      this.resizer = [];
      this.resizer.push(new Resizer(this, this.getStop));
    }

    PlayerArrow.prototype.redraw = function() {
      if (this.fabricObject) this.board.remove(this.fabricObject);
      this.fabricObject = Arrow.draw([this.player.x * this.board.width, this.player.y * this.board.height, this.resizer[0].fabricRect.left, this.resizer[0].fabricRect.top], this.color);
      return this.afterDrawing();
    };

    PlayerArrow.prototype.afterDrawing = function() {
      this.fabricObject.lockMovementY = true;
      this.fabricObject.lockMovementX = true;
      this.board.add(this.fabricObject);
      this.board.fabricCanvas.sendBackwards(this.fabricObject);
      this.board.fabricCanvas.sendBackwards(this.fabricObject);
      return this.board.fabricCanvas.sendBackwards(this.fabricObject);
    };

    PlayerArrow.prototype.getStart = function() {
      var start;
      return start = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[0].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[0].top
      };
    };

    PlayerArrow.prototype.getStop = function() {
      var stop;
      return stop = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[1].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[1].top
      };
    };

    PlayerArrow.prototype.serialize = function() {
      var serialized;
      return serialized = {
        type: PlayerArrow.type,
        stopPoint: {
          x: this.getStop().x / this.board.width,
          y: this.getStop().y / this.board.height
        },
        color: this.color
      };
    };

    return PlayerArrow;

  })(PitchElement);

  Plain = (function(_super) {

    __extends(Plain, _super);

    Plain.prototype.points = [];

    Plain.type = "plain";

    function Plain(board, args) {
      this.board = board;
      this.getPoint4 = __bind(this.getPoint4, this);
      this.getPoint3 = __bind(this.getPoint3, this);
      this.getPoint2 = __bind(this.getPoint2, this);
      this.getPoint1 = __bind(this.getPoint1, this);
      this.redraw = __bind(this.redraw, this);
      Plain.__super__.constructor.call(this, args);
      this.points[0] = {
        x: args.points[0].x * this.board.width,
        y: args.points[0].y * this.board.height
      };
      this.points[1] = {
        x: args.points[1].x * this.board.width,
        y: args.points[1].y * this.board.height
      };
      this.points[2] = {
        x: args.points[2].x * this.board.width,
        y: args.points[2].y * this.board.height
      };
      this.points[3] = {
        x: args.points[3].x * this.board.width,
        y: args.points[3].y * this.board.height
      };
      this.fabricObject = Plain.draw(this.points, this.board.width, this.board.height, this.color);
      this.board.add(this.fabricObject);
      this.board.fabricCanvas.sendToBack(this.fabricObject);
      this.accountForEditMode();
      this.resizer = [];
      this.resizer[0] = new Resizer(this, this.getPoint1);
      this.resizer[1] = new Resizer(this, this.getPoint2);
      this.resizer[2] = new Resizer(this, this.getPoint3);
      this.resizer[3] = new Resizer(this, this.getPoint4);
    }

    Plain.draw = function(points, canvasWidth, canvasHeight, color) {
      var group, intersect, l, line, start, stop, _i, _len, _ref;
      group = new fabric.Group();
      Plain.drawCorners(group, points, color);
      _ref = CanvasUtils.getDiagonalLines(canvasWidth, canvasHeight);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        intersect = fabric.Intersection.intersectLinePolygon(line.p1, line.p2, points);
        if (intersect.status === "Intersection") {
          start = intersect.points[0];
          stop = intersect.points[1];
          l = new fabric.Line([start.x, start.y, stop.x, stop.y], {
            fill: color,
            strokeWidth: 0.9
          });
          l.hasControls = l.hasBorders = l.selectable = false;
          group.add(l);
        }
      }
      group.hasControls = group.hasBorders = false;
      return group;
    };

    Plain.drawCorners = function(group, points, color) {
      var circle1, circle2, circle3, circle4;
      circle1 = new fabric.Circle({
        fill: color,
        radius: 1,
        left: points[0].x,
        top: points[0].y,
        opacity: 95
      });
      circle2 = new fabric.Circle({
        fill: color,
        radius: 1,
        left: points[1].x,
        top: points[1].y,
        opacity: 95
      });
      circle3 = new fabric.Circle({
        fill: color,
        radius: 1,
        left: points[2].x,
        top: points[2].y,
        opacity: 95
      });
      circle4 = new fabric.Circle({
        fill: color,
        radius: 1,
        left: points[3].x,
        top: points[3].y,
        opacity: 95
      });
      circle1.hasControls = circle1.hasBorders = circle1.selectable = false;
      circle2.hasControls = circle2.hasBorders = circle2.selectable = false;
      circle3.hasControls = circle3.hasBorders = circle3.selectable = false;
      circle4.hasControls = circle4.hasBorders = circle4.selectable = false;
      group.add(circle1);
      group.add(circle2);
      group.add(circle3);
      return group.add(circle4);
    };

    Plain.prototype.redraw = function() {
      if (this.fabricObject) this.board.remove(this.fabricObject);
      this.fabricObject = Plain.draw([this.resizer[0].getPoint(), this.resizer[1].getPoint(), this.resizer[2].getPoint(), this.resizer[3].getPoint()], this.board.width, this.board.height, this.color);
      this.board.add(this.fabricObject);
      return this.board.fabricCanvas.sendToBack(this.fabricObject);
    };

    Plain.prototype.getPoint1 = function() {
      var p1;
      return p1 = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[0].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[0].top
      };
    };

    Plain.prototype.getPoint2 = function() {
      var p2;
      return p2 = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[1].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[1].top
      };
    };

    Plain.prototype.getPoint3 = function() {
      var p3;
      return p3 = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[2].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[2].top
      };
    };

    Plain.prototype.getPoint4 = function() {
      var p4;
      return p4 = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[3].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[3].top
      };
    };

    Plain.prototype.serialize = function() {
      var obj;
      this.points = [this.getPoint1(), this.getPoint2(), this.getPoint3(), this.getPoint4()];
      return obj = {
        type: Plain.type,
        points: CanvasUtils.getRelativePoints(this.points, this.board.width, this.board.height),
        color: this.color
      };
    };

    return Plain;

  })(PitchElement);

  Arrow = (function(_super) {

    __extends(Arrow, _super);

    Arrow.prototype.coords = null;

    Arrow.type = "arrow";

    function Arrow(board, args) {
      this.board = board;
      this.getStop = __bind(this.getStop, this);
      this.getStart = __bind(this.getStart, this);
      this.redraw = __bind(this.redraw, this);
      Arrow.__super__.constructor.call(this, args);
      this.coords = [args.coords[0] * this.board.width, args.coords[1] * this.board.height, args.coords[2] * this.board.width, args.coords[3] * this.board.height];
      this.fabricObject = Arrow.draw(this.coords, this.color);
      this.board.add(this.fabricObject);
      this.accountForEditMode();
      this.resizer = [];
      this.resizer.push(new Resizer(this, this.getStart));
      this.resizer.push(new Resizer(this, this.getStop));
    }

    Arrow.draw = function(coords, color) {
      var circleStart, circleStop, group, line;
      color = color || 'black';
      group = new fabric.Group();
      circleStart = new fabric.Circle({
        fill: color,
        radius: 2,
        left: coords[0],
        top: coords[1],
        opacity: 95
      });
      circleStop = new fabric.Circle({
        fill: color,
        radius: 2,
        left: coords[2],
        top: coords[3],
        opacity: 95
      });
      line = new fabric.Line(coords, {
        fill: color,
        strokeWidth: 3
      });
      circleStart.hasControls = circleStart.hasBorders = circleStart.selectable = false;
      circleStop.hasControls = circleStop.hasBorders = circleStop.selectable = false;
      line.hasControls = line.hasBorders = line.selectable = false;
      group.hasControls = group.hasBorders = group.selectable = false;
      group.selectable = true;
      group.add(circleStart);
      group.add(circleStop);
      group.add(line);
      Arrow.drawArrowHead(group, coords, color);
      return group;
    };

    Arrow.drawArrowHead = function(group, coords, color) {
      var l1, l2, point1, point2, point3, vector, vector1, vector2;
      point1 = {
        x: coords[2],
        y: coords[3]
      };
      vector = CanvasUtils.vector(point1, {
        x: coords[0],
        y: coords[1]
      });
      vector1 = CanvasUtils.mul(CanvasUtils.rotateVector(vector, 0.6), 10);
      vector2 = CanvasUtils.mul(CanvasUtils.rotateVector(vector, -0.6), 10);
      point2 = CanvasUtils.add(point1, vector1);
      point3 = CanvasUtils.add(point1, vector2);
      console.debug(vector);
      console.debug(vector1);
      l1 = new fabric.Line([point1.x, point1.y, point2.x, point2.y], {
        strokeWidth: 2,
        fill: color
      });
      l2 = new fabric.Line([point1.x, point1.y, point3.x, point3.y], {
        strokeWidth: 2,
        fill: color
      });
      l1.hasControls = l1.hasBorders = l1.selectable = false;
      l2.hasControls = l2.hasBorders = l2.selectable = false;
      group.add(l1);
      return group.add(l2);
    };

    Arrow.prototype.redraw = function() {
      if (this.fabricObject) this.board.remove(this.fabricObject);
      this.fabricObject = Arrow.draw([this.resizer[0].fabricRect.left, this.resizer[0].fabricRect.top, this.resizer[1].fabricRect.left, this.resizer[1].fabricRect.top], this.color);
      this.board.add(this.fabricObject);
      this.board.fabricCanvas.sendBackwards(this.fabricObject);
      this.board.fabricCanvas.sendBackwards(this.fabricObject);
      return this.board.fabricCanvas.sendBackwards(this.fabricObject);
    };

    Arrow.prototype.getStart = function() {
      var start;
      return start = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[0].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[0].top
      };
    };

    Arrow.prototype.getStop = function() {
      var stop;
      return stop = {
        x: this.fabricObject.left + this.fabricObject.getObjects()[1].left,
        y: this.fabricObject.top + this.fabricObject.getObjects()[1].top
      };
    };

    Arrow.prototype.serialize = function() {
      return {
        type: Arrow.type,
        coords: [this.getStart().x / this.board.width, this.getStart().y / this.board.height, this.getStop().x / this.board.width, this.getStop().y / this.board.height],
        color: this.color
      };
    };

    return Arrow;

  })(PitchElement);

  Path = (function(_super) {

    __extends(Path, _super);

    Path.type = "path";

    function Path(board, args) {
      this.board = board;
      Path.__super__.constructor.call(this, args);
      args.width = args.width * this.board.width;
      args.height = args.height * this.board.height;
      args.left = args.left * this.board.width;
      args.top = args.top * this.board.height;
      args.path = Path.absolutePaths(args.path, this.board.width, this.board.height);
      this.fabricObject = Path.draw(args, this.color);
      console.debug(this.fabricObject);
      this.board.add(this.fabricObject);
      this.accountForEditMode();
    }

    Path.relativePaths = function(paths, width, height) {
      var p, path, _i, _len;
      p = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        p.push([path[0], path[1] / width, path[2] / height]);
      }
      return p;
    };

    Path.absolutePaths = function(paths, width, height) {
      var p, path, _i, _len;
      p = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        p.push([path[0], path[1] * width, path[2] * height]);
      }
      return p;
    };

    Path.draw = function(options, color) {
      var path;
      path = new fabric.Path(options.path, {
        left: options.left,
        top: options.top,
        width: options.width,
        height: options.height,
        stroke: color,
        strokeWidth: 3,
        fill: ''
      });
      path.hasBorders = path.hasControls = false;
      return path;
    };

    Path.prototype.serialize = function() {
      var obj;
      return obj = {
        type: Path.type,
        width: this.fabricObject.width / this.board.width,
        height: this.fabricObject.height / this.board.height,
        left: this.fabricObject.left / this.board.width,
        top: this.fabricObject.top / this.board.height,
        path: Path.relativePaths(this.fabricObject.path, this.board.width, this.board.height),
        color: this.color
      };
    };

    return Path;

  })(PitchElement);

  Array.prototype.remove = function(e) {
    var t, _ref;
    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
    }
  };

  CanvasUtils = (function() {

    function CanvasUtils() {}

    CanvasUtils.tempObj = {
      startPoint: null,
      obj: null
    };

    CanvasUtils.getMidPoint = function(x1, y1, x2, y2) {
      var midX, midY, xAbs, yAbs;
      xAbs = Math.abs(x1 - x2);
      yAbs = Math.abs(y1 - y2);
      if (x1 < x2) {
        midX = x1 + xAbs / 2;
      } else {
        midX = x2 + xAbs / 2;
      }
      if (y1 < y2) {
        midY = y1 + yAbs / 2;
      } else {
        midY = y2 + yAbs / 2;
      }
      point.x = midX;
      point.y = midY;
      return point;
    };

    CanvasUtils.getMouseOnCanvas = function(e, canvasId) {
      var point, x, y;
      x = e.memo.e.clientX;
      y = e.memo.e.clientY;
      return point = {
        x: x - $("#" + canvasId).offset().left + window.scrollX,
        y: y - $("#" + canvasId).offset().top + window.scrollY
      };
    };

    CanvasUtils.getRelativeCoords = function(coords, width, height) {
      return coords = [coords[0] / width, coords[1] / height, coords[2] / width, coords[3] / height];
    };

    CanvasUtils.getRelativePoints = function(points, width, height) {
      var point, relPoints, _i, _len;
      relPoints = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        relPoints.push({
          x: point.x / width,
          y: point.y / height
        });
      }
      return relPoints;
    };

    CanvasUtils.getRelativePoint = function(point, width, height) {
      var p;
      return p = {
        x: point.x / width,
        y: point.y / height
      };
    };

    CanvasUtils.getDiagonalLines = function(width, height) {
      var interval, lines, start, stop;
      interval = 8;
      lines = [];
      start = {
        x: 5,
        y: 0
      };
      stop = {
        x: 0,
        y: 5
      };
      while (start.x < width) {
        start.x += interval;
        if (stop.y < height) {
          stop.y += interval;
        } else {
          stop.y = height;
          stop.x += interval;
        }
        lines.push({
          p1: {
            x: start.x,
            y: start.y
          },
          p2: {
            x: stop.x,
            y: stop.y
          }
        });
      }
      start = {
        x: width,
        y: 0
      };
      while (start.y < height) {
        start.y += interval;
        if (stop.y < height) {
          stop.y += interval;
        } else {
          stop.y = height;
          stop.x += interval;
        }
        lines.push({
          p1: {
            x: start.x,
            y: start.y
          },
          p2: {
            x: stop.x,
            y: stop.y
          }
        });
      }
      return lines;
    };

    CanvasUtils.vector = function(start, stop) {
      var vector;
      return vector = {
        x: stop.x - start.x,
        y: stop.y - start.y
      };
    };

    CanvasUtils.rotateVector = function(a, phi) {
      var result;
      return result = {
        x: Math.cos(Math.atan2(a.y, a.x) + phi),
        y: Math.sin(Math.atan2(a.y, a.x) + phi)
      };
    };

    CanvasUtils.add = function(v1, v2) {
      var v;
      return v = {
        x: v1.x + v2.x,
        y: v1.y + v2.y
      };
    };

    CanvasUtils.mul = function(v1, fac) {
      var v;
      return v = {
        x: v1.x * fac,
        y: v1.y * fac
      };
    };

    return CanvasUtils;

  })();

  Views = (function() {

    function Views() {}

    Views.buildToolbar = function(teamCount, playerLabel) {
      var content, numChecked, posChecked, team1Checked, team2Checked;
      if (teamCount === 1) team1Checked = "checked='checked'";
      if (teamCount === 2) team2Checked = "checked='checked'";
      if (playerLabel === Player.positionLabel) posChecked = "checked='checked'";
      if (playerLabel === Player.numberLabel) numChecked = "checked='checked'";
      content = "<label class=\"explanation\">Tools</label>\n<span style=\"display: inline-block\">\n  <select id='colorSelector' name='colorSelector' class='customicons'>\n    <option value='#262626' class='blackColor'>&nbsp;</option>\n    <option value='#252ABD' class='blueColor'>&nbsp;</option>\n    <option value='#BD2525' class='redColor'>&nbsp;</option>\n    <option value='#E0D839' class='yellowColor'>&nbsp;</option>\n  </select>\n</span>\n<span id='paintButtons'>\n  <input type='checkbox' id='paint' /><label for='paint'>Free Painting</label>\n  <input type='checkbox' id='drawLine' /><label for='drawLine'>Arrow</label>\n  <input type='checkbox' id='drawRect' /><label for='drawRect'>Plain</label>\n</span>\n\n<label class=\"explanation\">Teams</label>\n<span id='teamCountChoice'>\n  <input type='radio' id='teamCount1' name='teamCountChoice' " + team1Checked + " /><label for='teamCount1'>1</label>\n  <input type='radio' id='teamCount2' name='teamCountChoice'  " + team2Checked + "  /><label for='teamCount2'>2</label>\n</span>\n\n\n<label class=\"explanation\">Playerlabel</label>\n<span id='labelChoice'>\n  <input type='radio' id='show_position' name='labelChoice' " + posChecked + "  /><label for='show_position'>Position</label>\n  <input type='radio' id='show_number' name='labelChoice'  " + numChecked + "  /><label for='show_number'>Number</label>\n</span>";
      return $("#toolbar").html(content);
    };

    Views.buildTableTabs = function(teamCount) {
      var content, guest1, guest2;
      guest1 = guest2 = "";
      if (teamCount === 2) guest1 = "<li><a href='#guestTable'>Team 2</a></li>";
      if (teamCount === 2) guest2 = "<div id='guestTable'></div>";
      content = "<ul>\n  <li><a href=\"#homeTable\">Team 1</a></li>\n  " + guest1 + "\n</ul>\n<div id=\"homeTable\"></div>\n" + guest2;
      $("#player_tab").html(content);
      return $("#player_tab").tabs({
        tabTemplate: "<li><a href='#guestTable'>Team 2</a></li>",
        add: function(event, ui) {
          return $(ui.panel).append("<div id='guestTable'></div>");
        }
      });
    };

    return Views;

  })();

}).call(this);
