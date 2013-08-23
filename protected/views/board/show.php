<?php
Yii::app()->clientScript->registerMetaTag($board->titel, 'og:title');
Yii::app()->clientScript->registerMetaTag($board->beschreibung, 'og:description');
Yii::app()->clientScript->registerMetaTag("http://tacticboards.xaga.de/img/boards/thumbs/" . $board->id . ".png", 'og:image');

$this->pageTitle = Yii::app()->name . ' - TacticBoard';
?>
<script type="text/javascript">
    $(document).ready(function() {
        initPost("commentForm", function(response) {
            if (response == "error") {
                alert("oops. something went wrong");
            } else {
                window.location.href = "<?php echo Yii::app()->createUrl("board/view") ?>" + "&id=" + "<? echo $board->id ?>";
            }
        });

        boardController = new BoardController({
            canvasId: "pitch_600",
            data: <?php echo $board->json; ?>,
            editMode: false,
            showTables: true
        });
    });

    
</script>
<h3><?php echo $board->titel; ?> 
    <? if (isset(Yii::app()->user->id) && Yii::app()->user->id == $board->ersteller_id) { ?>
        <small>[ <a href="<?php echo Yii::app()->createUrl("board/edit") . '&id=' . $board->id ?>">Edit</a> ]</small>
    <? } ?>
    <? if (isset(Yii::app()->user->id)) { ?>
        <small>[ <a href="<?php echo Yii::app()->createUrl("board/create") . '&b=' . $board->id ?>">Refine</a> ]</small>
    <? } ?>
    <br />
    <small></small>
</h3>
<div id="canvas_container">
    <canvas id="pitch_600" width="650px" height="454px"></canvas>
</div>
<div id="player_tab"></div>
<div class="clear"></div>
<div class="viewFields" style="text-align: center; width: 630px">
    created By: <b><? echo $board->user->nutzername; ?></b>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
    created At: <b><? echo $board->erstellt_am; ?></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    views: <b><? echo $board->aufrufe; ?></b>
</div>

<div class="showComments">
<? if ($board->beschreibung != "") { ?>
        <h3>Description</h3>
        <pre><?php echo $board->beschreibung; ?></pre>
<? } ?>

<h3>Comments</h3>
<?
$this->widget('zii.widgets.CListView', array(
    'dataProvider' => $comments,
    'itemView' => '_commentView',
));
?>


<br />
<br />
<?php
if (isset(Yii::app()->user->nutzername)) {
$form = $this->beginWidget('CActiveForm', array(
    'action' => Yii::app()->createUrl("comment/create"),
    'id' => 'commentForm'
        ));
?>
<input type="hidden" name="comment[boardId]" value="<? echo $board->id ?>" />
<div class="formFields">
    <div class="cell m">
        <label>comment</label>
    </div>
    <div class="cell end">
        <textarea class="xl" name="comment[text]" validation="required" maxlength="500"></textarea>
    </div>
</div>



<input type="submit" value="Post Comment" />
<?php $this->endWidget(); ?>
<? } ?>

</div>
<div class="showRelatedBoards">
  
    
</div>

<br class="clear" />







