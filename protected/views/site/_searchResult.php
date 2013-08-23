<div class="searchResultBox">
	<div class="searchHeader">
		<div class="rect"></div>
		<div class="headerInfo">created by: <? echo $data->user->nutzername ?> | created at: <?= Yii::app()->dateFormatter->format('MMM dd, yyyy', $data->erstellt_am) ?></div>
	</div>
	<div onclick="window.location.href = '<?php echo Yii::app()->createUrl("board/view").'&id='.$data->id ?>'" class="canvas_container"><img width="150" src="<?= Yii::app()->baseUrl.'/img/boards/thumbs/'.$data->id.'.png' ?>" /></div>	
<div class="textWithInfo">
	<span><a href="<?php echo Yii::app()->createUrl("board/view").'&id='.$data->id ?>"><?php echo $data->titel; ?></a><br />
	</span>views: <? echo $data->aufrufe; ?> <br />	
	comments: 
</div>
	<div class="clear"></div>
</div>