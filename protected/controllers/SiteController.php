<?php

class SiteController extends Controller {

	/**
	 * Declares class-based actions.
	 */
	public function actions() {
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha' => array(
				'class' => 'CCaptchaAction',
				'backColor' => 0xFFFFFF,
			),
			// page action renders "static" pages stored under 'protected/views/site/pages'
			// They can be accessed via: index.php?r=site/page&view=FileName
			'page' => array(
				'class' => 'CViewAction',
			),
		);
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex() {
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		$this->render('index');
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError() {
		if ($error = Yii::app()->errorHandler->error) {
			if (Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}

	/**
	 * Displays the contact page
	 */
	public function actionContact() {
		$contact = new Contact;
		if (isset($_POST['contact-form'])) {
			$contact->id = $this->uniqueId();
			$contact->attributes = $_POST['contact-form'];
			$contact->save();
			echo "ok";
			Yii::app()->end();
		}
		$this->render('contact');
	}

	/**
	 * Displays the login page
	 */
	public function actionLogin() {

		if (isset($_POST['loginForm'])) {
			$email = $_POST['loginForm']['email'];
			$passwort = $_POST['loginForm']['passwort'];
			// validate user input and redirect to the previous page if valid
			if (User::model()->login($email, $passwort))
				echo "ok";
			else
				echo "error";

			Yii::app()->end();
		}
		// display the login form
		$this->render('login');
	}

	public function actionRegister() {
		if (isset($_POST['registerForm'])) {
			$user = new User;
			$user->email = $_POST['registerForm']['email'];
			$user->nutzername = $_POST['registerForm']['nutzername'];
			$passwort = $this->createPassword();
			$user->passwort = md5($passwort);
			$user->id = $this->uniqueId();
			if (User::model()->userExists($user)) {
				echo "error";
			} else {
				$user->save();
				$this->sendWelcomeMail($user->email, $passwort);
				echo "ok";
			}
			Yii::app()->end();
		}
		$this->render('register');
	}

	/**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout() {
		Yii::app()->user->logout();
		$this->redirect(Yii::app()->homeUrl);
	}

	private function sendWelcomeMail($email, $passwort) {
		$betreff = "Welcome To TacticBoards.xaga.de";
		// Template mit dem Mailbody laden und fï¿½r den Versand vorbereiten
		$mailbody = file_get_contents(dirname(__FILE__) . '/Registrationmail.txt');
		// Platzhalter mit den Benutzereingaben ersetzen
		$mailbody = str_replace('###PASSWORT###', $passwort, $mailbody);
		$mailbody = str_replace('###EMAIL###', $email, $mailbody);
		$absender = 'stefan@xaga.de';
		// Mail Header erstellen

		$header = ("From: " . $absender . "\r\n");
		$header .= ("Reply-To: " . $absender . "\r\n");
		$header .= ("Return-Path: " . $absender . "\r\n");
		$header .= ("X-Mailer: PHP/" . phpversion() . "\r\n");
		$header .= ("X-Sender-IP: " . $REMOTE_ADDR . "\r\n");
		$header .= ("Content-type: text");

		// Email versenden
		@mail($email, $betreff, $mailbody, $header, "-f stefan@xaga.de");
	}

	private function createPassword() {
		//Passwort generieren
		$laenge = 8;
		$string = md5((string) mt_rand() . $_SERVER['REMOTE_ADDR'] . time());
		$start = rand(0, strlen($string) - $laenge);
		$passwort = substr($string, $start, $laenge);
		return $passwort;
	}

	public function actionSearch($search) {
		$boards = Board::model()->search($search);
		$dataProvider = new CArrayDataProvider($boards, array(
					'keyField' => 'id',
					'pagination' => array(
						'pageSize' => 8,
					),
				));
		$this->render('search', array('dataProvider' => $dataProvider));
	}

}