<? if (count($user->boards) > 0) : 
	$board1 = $user->boards[0];	?>
<h3>My Newest Tactic Boards</h3>

<div class="searchResultBox">
	<div class="searchHeader">
		<div class="rect"></div>
		<div class="headerInfo">created at: <? echo $board1->erstellt_am; ?></div>
	</div>
	<div onclick="window.location.href = '<?php echo Yii::app()->createUrl("board/view").'&id='.$board1->id ?>'" class="canvas_container"><img width="150" src="<?= Yii::app()->baseUrl.'/img/boards/thumbs/'.$board1->id.'.png' ?>" /></div>	
<div class="textWithInfo">
	<span><a href="<?php echo Yii::app()->createUrl("board/view").'&id='.$board1->id ?>"><?php echo $board1->titel; ?></a><br />
	</span>Views: <? echo $board1->aufrufe; ?> <br />	
	Comments: <? echo count($board1->comments) ?> 
</div>
	<div class="clear"></div>
</div>

<? if (count($user->boards) > 1) : 
	$board2 = $user->boards[1];	?>
<div class="searchResultBox">
	<div class="searchHeader">
		<div class="rect"></div>
		<div class="headerInfo">created at: <? echo $board2->erstellt_am; ?></div>
	</div>
	<div onclick="window.location.href = '<?php echo Yii::app()->createUrl("board/view").'&id='.$board2->id ?>'" class="canvas_container"><img width="150" src="<?= Yii::app()->baseUrl.'/img/boards/thumbs/'.$board2->id.'.png' ?>" /></div>	
<div class="textWithInfo">
	<span><a href="<?php echo Yii::app()->createUrl("board/view").'&id='.$board2->id ?>"><?php echo $board2->titel; ?></a><br />
	</span>Views: <? echo $board2->aufrufe; ?> <br />	
	Comments: 
</div>
	<div class="clear"></div>
</div>
<? endif; ?>

<a href="<?php echo Yii::app()->createUrl('/user/myTacticBoards'); ?>">Show All</a><br /><br />
<? endif; ?>



<h3>My Profile</h3>

<div class="viewFields">
<div class="cell m">
	<label>Username</label>
</div>
<div class="cell end">
	<span><? echo $user->nutzername; ?></span>
</div>
<div class="cell m">
	<label>Email</label>
</div>
<div class="cell end">
	<span><? echo $user->email; ?></span>
</div>
</div>

<a href="<?php echo Yii::app()->createUrl('/user/changePassword'); ?>">Change Password</a> | <a href="<?php echo Yii::app()->createUrl('/site/logout'); ?>">Logout</a>