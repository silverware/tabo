<?php

/**
 * This is the model class for table "user".
 *
 * The followings are the available columns in table 'user':
 * @property integer $id
 * @property string $nutzername
 * @property string $passwort
 * @property string $email
 */
class User extends CActiveRecord {

	/**
	 * Returns the static model of the specified AR class.
	 * @return User the static model class
	 */
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName() {
		return 'user';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules() {
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('id, nutzername, passwort, email', 'required'),
			array('nutzername, passwort, email', 'length', 'max' => 255),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, nutzername, passwort, email', 'safe', 'on' => 'search'),
		);
	}

	public function relations() {
		return array(
			'boards' => array(self::HAS_MANY, 'Board', 'ersteller_id', 'order' => 'erstellt_am DESC'),
			'comments' => array(self::HAS_MANY, 'Comment', 'ersteller_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels() {
		return array(
			'id' => 'ID',
			'nutzername' => 'Nutzername',
			'passwort' => 'Passwort',
			'email' => 'Email'
		);
	}

	/**
	 * Logs in the user using the given username and password in the model.
	 * @return boolean whether login is successful
	 */
	public function login($email, $passwort) {
		$identity = new UserIdentity($email, $passwort);
		if ($identity->authenticate()) {
			$duration = 3600 * 24 * 30; // 30 days
			Yii::app()->user->login($identity, $duration);
			return true;
		} else {
			return false;
		}
	}

	public function userExists($user) {
		$found = User::model()->find("email=:email OR nutzername=:nutzername", array('email' => $user->email, 'nutzername' => $user->nutzername));
		if ($found == null) {
			return false;
		} else {
			return true;
		}
	}

}