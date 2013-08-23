<?php

/**
 * This is the model class for table "board".
 *
 * The followings are the available columns in table 'board':
 * @property string $id
 * @property string $ersteller_id
 * @property string $parent_board
 * @property string $json
 * @property string $titel
 * @property string $beschreibung
 */
class Board extends CActiveRecord {

	/**
	 * Returns the static model of the specified AR class.
	 * @return Board the static model class
	 */
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName() {
		return 'board';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules() {
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('titel', 'required'),
			array('titel', 'length', 'max' => 100),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('json, titel, beschreibung', 'safe', 'on' => 'search'),
		);
	}

	public function relations() {
		return array(
			'user' => array(self::BELONGS_TO, 'User', 'ersteller_id'),
			'comments' => array(self::HAS_MANY, 'Comment', 'board_id'),
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search($search) {
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		return Board::model()->with('user')->findAll(array('select' => '*, MATCH (titel) AGAINST ("' . $search . '") as matches', 'condition' => 'MATCH (titel, beschreibung) AGAINST ("' . $search . '")', 'order' => 'matches'));
	}

}