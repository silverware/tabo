DEFENSE = "#DBF208"
MIDFIELD = "#17DF10"
OFFENSE = "#3A53DC"
GOALKEEPER = "#E27100"

class FootballBoard extends Board

  @positions:
    TW:
      label: "GK"
      part: GOALKEEPER
    IV:
      label: "CB"
      part: DEFENSE
    RV:
      label: "RB"
      part: DEFENSE
    RAV:
      label: "RWB"
      part: DEFENSE
    LV:
      label: "LB"
      part: DEFENSE
    LAV:
      label: "LWB"
      part: DEFENSE
    ZDM:
      label: "CDM"
      part: MIDFIELD
    ZM:
      label: "CM"
      part: MIDFIELD
    ZOM:
      label: "CAM"
      part: MIDFIELD
    RM:
      label: "RM"
      part: MIDFIELD
    LM:
      label: "LM"
      part: MIDFIELD
    LS:
      label: "LF"
      part: OFFENSE
    RS:
      label: "RF"
      part: OFFENSE
    ST:
      label: "ST"
      part: OFFENSE

  @initialHomePlayerData:
    1:
      type: "player"
      id: "1"
      x: 0.04
      y: 0.5
      label:"Player 1"
      number:"1"
      home: true
      position: "TW"
    2:
      type: "player"
      id: "2"
      x: 0.16
      y: 0.2 
      label:"Player 2"
      number:"2"
      home: true
      position: "LV"
    3:
      type: "player"
      id: "3" 
      x: 0.16 
      y: 0.4 
      label:"Player 3" 
      number:"3"
      home: true 
      position: "IV"
    4:
      type: "player"
      id: "4" 
      x: 0.16 
      y: 0.6 
      label:"Player 4" 
      number:"4"
      home: true 
      position: "IV"
    5:
      type: "player"
      id: "5" 
      x: 0.16 
      y: 0.8 
      label:"Player 5" 
      number:"5"
      home: true 
      position: "RV"
    6:
      type: "player"
      id: "6" 
      x: 0.3 
      y: 0.2 
      label:"Player 6" 
      number:"6"
      home: true 
      position: "LM"
    7:
      type: "player"
      id: "7" 
      x: 0.3 
      y: 0.4 
      label:"Player 7" 
      number:"7"
      home: true 
      position: "ZM"
    8:
      type: "player"
      id: "8" 
      x: 0.3 
      y: 0.6 
      label:"Player 8" 
      number:"8"
      home: true 
      position: "ZM"
    9:
      type: "player"
      id: "9" 
      x: 0.3 
      y: 0.8 
      label:"Player 9" 
      number:"9"
      home: true 
      position: "RM"
    10:
      type: "player"
      id: "10" 
      x: 0.45 
      y: 0.4 
      label:"Player 10" 
      number:"10"
      home: true 
      position: "ST"
    11:
      type: "player"
      id: "11" 
      x: 0.45 
      y: 0.6 
      label:"Player 11" 
      number:"11"
      home: true 
      position: "ST"

  @initialGuestPlayerData:
    12:
      type: "player"
      id: "12" 
      x: 0.96 
      y: 0.5 
      label:"Player 1" 
      number:"1"
      home: false 
      position: "TW"
    13:
      type: "player"
      id: "13" 
      x: 0.84 
      y: 0.2 
      label:"Player 2" 
      number:"2"
      home: false 
      position: "RV"
    14:
      type: "player"
      id: "14" 
      x: 0.84 
      y: 0.4 
      label:"Player 3" 
      number:"3"
      home: false 
      position: "IV"
    15:
      type: "player"
      id: "15" 
      x: 0.84 
      y: 0.6 
      label:"Player 4" 
      number:"4"
      home: false 
      position: "IV"
    16:
      type: "player"
      id: "16" 
      x: 0.84 
      y: 0.8 
      label:"Player 5" 
      number:"5"
      home: false 
      position: "LV"
    17:
      type: "player"  
      id: "17" 
      x: 0.7 
      y: 0.2 
      label:"Player 6" 
      number:"6"
      home: false 
      position: "RM"
    18:
      type: "player"
      id: "18" 
      x: 0.7 
      y: 0.4 
      label:"Player 7" 
      number:"7"
      home: false 
      position: "ZM"
    19:
      type: "player"
      id: "19" 
      x: 0.7 
      y: 0.6 
      label:"Player 8" 
      number:"8"
      home: false 
      position: "ZM"
    20:
      type: "player"
      id: "20" 
      x: 0.7 
      y: 0.8 
      label:"Player 9" 
      number:"9"
      home: false 
      position: "LM"
    21:
      type: "player"
      id: "21" 
      x: 0.55 
      y: 0.4 
      label:"Player 10" 
      number:"10"
      home: false 
      position: "ST"
    22:
      type: "player"
      id: "22" 
      x: 0.55 
      y: 0.6 
      label:"Player 11" 
      number:"11"
      home: false 
      position: "ST"
      
  maxTeamSize: 11
  
  getNewPlayer: ->
    player =
      type: "player"
      id: uniqueId() 
      x: 0.5 
      y: 0.5 
      label: "Player" 
      number: "11"
      position: "ST"
  
  initialHomePlayerData: ->
    FootballBoard.initialHomePlayerData
    

  initialGuestPlayerData: ->
    FootballBoard.initialGuestPlayerData

  positions: ->
    FootballBoard.positions