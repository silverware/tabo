<?php

class UserIdentity extends CUserIdentity {

	private $_id;

	public function authenticate() {
		$user = User::model()->findByAttributes(array('email' => $this->username, 'passwort' => md5($this->password)));

		if ($user === null) {
			return false;
		}
		$this->_id = $user->id;
		$this->setState('nutzername', $user->nutzername);
		return true;
	}

	public function getId() {
		return $this->_id;
	}
}