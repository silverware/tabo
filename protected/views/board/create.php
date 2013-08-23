<script type="text/javascript">
    var boardController;
    $(document).ready(function() {
        boardController = new BoardController({
            canvasId: "pitch_600",
            sportType: "football",
            <? if (isset($refBoard)) { echo "data: ". $refBoard->json.","; } ?>
            showTables: true,
            editMode: true
          });
        
        initPost("boardForm", function(response) {
            hideLoading();
            if (response == "error") {
                alert("oops. something went wrong");
            } else {
                window.location.href = "<?php echo Yii::app()->createUrl("board/view") ?>" + "&id=" + response;
            }
        });
    });

    function submitForm() {
        showLoading();
        setTimeout(function() { 
            $("#json").val(boardController.serialize());
            $("#image").val(boardController.getCanvasImage());
            $("#boardForm").submit();
        }, 1000);
	
    }

    
</script>
<div id="toolbar"></div>
<div id="canvas_container">
    <canvas id="pitch_600" width="650px" height="454px"></canvas>
</div>
<div id="player_tab"></div>
<div class="clear"></div>

<? if (isset(Yii::app()->user->id)) { ?>
    <h3>Informations        
      <? if (isset($refBoard)) { ?>
           - Refining of <?= $refBoard->titel ?>
        <? } ?>
    </h3>

    <?php
    $form = $this->beginWidget('CActiveForm', array(
        'action' => Yii::app()->createUrl("board/createPost"),
        'id' => 'boardForm',
        'enableAjaxValidation' => true,
            ));
    ?>
    <div class="formFields" width="650px">
        <input type="hidden" name="board[ref]" value="<? if (isset($refBoard)) echo $refBoard->id; ?>" />
        <input type="hidden" name="board[json]" id="json" />
        <input type="hidden" name="board[image]" id="image" />
        <div class="cell m">
            <label>Title*</label>
        </div>
        <div class="cell end">
            <input class="xl" type="text" name="board[titel]" validation="required" maxlength="100" />
        </div>
        <div class="cell m">
            <label>Description</label>
        </div>
        <div class="cell end">
            <textarea class="xl" name="board[beschreibung]" maxlength="500"></textarea>
        </div>
    </div>

    <?php $this->endWidget(); ?>

    <input onclick="submitForm();" type="submit" value="Save" />
<?php } else { ?>
    <div class="info">
        You need to be registered to save your Tactic Board.
        <a href="<?php echo Yii::app()->createUrl("site/register") ?>">Register Now</a>
    </div>
<? } ?>
