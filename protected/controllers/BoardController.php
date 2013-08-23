<?php

class BoardController extends Controller {

	public function actionCreateBase() {
		$this->render('create');
	}

  public function actionCreate($b) {
		$this->render('create', array('refBoard' => $this->loadModel($b)));
	}

	public function actionCreatePost() {
		$board = new Board;
		$board->id = $this->uniqueId();
		$board->ersteller_id = Yii::app()->user->id;
    $board->parent_board = $_POST["board"]["ref"];
		$this->saveBoard($board, $_POST["board"]);
	}

	public function actionView($id) {
		$board = $this->loadModel($id);
		$board->aufrufe = $board->aufrufe + 1;
		$board->save();
		$comments = new CArrayDataProvider($board->comments, array(
					'keyField' => 'id',
					'pagination' => array(
						'pageSize' => 8,
					),
				));
		$this->render('show', array('board' => $this->loadModel($id), 'comments' => $comments));
	}

	public function actionEdit($id) {
		$board = $this->loadModel($id);
		$this->render('edit', array('board' => $board));
	}

	public function actionEditPost($id) {
		$board = $this->loadModel($id);
		$this->saveBoard($board, $_POST["board"]);
	}

	private function saveBoard($board, $params) {
		$board->titel = $params["titel"];
		$board->beschreibung = $params["beschreibung"];
		$board->json = $params["json"];
    $this->saveImage($params["image"], $board->id);
		if ($board->save()) {
			echo $board->id;
		} else {
			echo "error";
		}
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer the ID of the model to be loaded
	 */
	public function loadModel($id) {
		$model = Board::model()->findByPk($id);
		if ($model === null)
			throw new CHttpException(404, 'The requested page does not exist.');
		return $model;
	}
  
  
  private function saveImage($data, $boardId) {
    $imageData = base64_decode($data);
    $img = imagecreatefromstring($imageData);
    $width = imagesx($img);
    $height = imagesy($img);

    $newWidth = 150;
    // calculate thumbnail size
    $newHeight = floor( $height * ( $newWidth / $width ));
    // create a new temporary image
    $thumb = imagecreatetruecolor($newWidth, $newHeight);

    // copy and resize old image into new image
    imagecopyresampled($thumb, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    $urlUploadImages = realpath(Yii::app()->baseUrl);
    // save thumbnail into a file
    imagepng($img, $urlUploadImages."/img/boards/".$boardId.".png");
    imagepng($thumb, $urlUploadImages."/img/boards/thumbs/".$boardId.".png");
  }
}