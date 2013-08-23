<?php

class CommentController extends Controller {

	public function actionCreate() {
		$comment = new Comment;
		$comment->ersteller_id = Yii::app()->user->id;
		$comment->board_id = $_POST['comment']['boardId'];
		$comment->titel = $_POST['comment']['text'];
		$comment->id = $this->uniqueId();
		if ($comment->save()) {
			echo "ok";
		} else {
			echo "error";
		}
		Yii::app()->end();
	}

}
