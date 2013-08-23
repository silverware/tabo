class Views

  @buildToolbar: (teamCount, playerLabel) ->
    team1Checked = "checked='checked'" if teamCount is 1
    team2Checked = "checked='checked'" if teamCount is 2
    posChecked = "checked='checked'" if playerLabel is Player.positionLabel
    numChecked = "checked='checked'" if playerLabel is Player.numberLabel
    
    content = """
              <label class="explanation">Tools</label>
              <span style="display: inline-block">
                <select id='colorSelector' name='colorSelector' class='customicons'>
                  <option value='#262626' class='blackColor'>&nbsp;</option>
                  <option value='#252ABD' class='blueColor'>&nbsp;</option>
                  <option value='#BD2525' class='redColor'>&nbsp;</option>
                  <option value='#E0D839' class='yellowColor'>&nbsp;</option>
                </select>
              </span>
              <span id='paintButtons'>
                <input type='checkbox' id='paint' /><label for='paint'>Free Painting</label>
                <input type='checkbox' id='drawLine' /><label for='drawLine'>Arrow</label>
                <input type='checkbox' id='drawRect' /><label for='drawRect'>Plain</label>
              </span>
              
              <label class="explanation">Teams</label>
              <span id='teamCountChoice'>
                <input type='radio' id='teamCount1' name='teamCountChoice' #{team1Checked} /><label for='teamCount1'>1</label>
                <input type='radio' id='teamCount2' name='teamCountChoice'  #{team2Checked}  /><label for='teamCount2'>2</label>
              </span>
              
              
              <label class="explanation">Playerlabel</label>
              <span id='labelChoice'>
                <input type='radio' id='show_position' name='labelChoice' #{posChecked}  /><label for='show_position'>Position</label>
                <input type='radio' id='show_number' name='labelChoice'  #{numChecked}  /><label for='show_number'>Number</label>
              </span>
              """
    $("#toolbar").html content
    
  @buildTableTabs: (teamCount) ->
    guest1 = guest2 = ""
    guest1 = "<li><a href='#guestTable'>Team 2</a></li>" if teamCount is 2
    guest2 = "<div id='guestTable'></div>" if teamCount is 2
    content = """
                <ul>
                  <li><a href="#homeTable">Team 1</a></li>
                  #{guest1}
                </ul>
                <div id="homeTable"></div>
                #{guest2}
               """
    $("#player_tab").html content
    $("#player_tab").tabs
        tabTemplate: "<li><a href='#guestTable'>Team 2</a></li>"
        add: (event, ui) ->
          $(ui.panel).append( "<div id='guestTable'></div>")