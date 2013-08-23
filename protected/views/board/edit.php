<script type="text/javascript">
    var boardController;
    $(document).ready(function() {
        boardController = new BoardController({
            canvasId: "pitch_600",
            data: <?php echo $board->json; ?>,
            editMode: true,
            showTables: true
        });
        initPost("boardForm", function(response) {
            if (response != "error") {
                showNotification({success: true});
            }
        });
    });

    function updateJson() {
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

<h3>Informations</h3>

<?php
$form = $this->beginWidget('CActiveForm', array(
    'action' => Yii::app()->createUrl("board/editPost") . '&id=' . $board->id,
    'id' => 'boardForm',
        ));
?>
<div class="formFields" width="650px">
    <input type="hidden" name="board[json]" id="json" />
    <input type="hidden" name="board[image]" id="image" />
    <div class="cell m">
        <label for="titel">Title</label>
    </div>
    <div class="cell end">
        <input class="xl" value="<?php echo $board->titel; ?>" type="text" name="board[titel]" validation="required" maxlength="100" />
    </div>
    <div class="cell m">
        <label for="beschreibung">Description</label>
    </div>
    <div class="cell end">
        <textarea class="xl" name="board[beschreibung]" maxlength="500"><?php echo $board->beschreibung; ?></textarea>
    </div>
</div>
<?php $this->endWidget(); ?>
<input onclick="updateJson();" type="submit" value="Update"></input>

