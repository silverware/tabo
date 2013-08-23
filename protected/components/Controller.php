<?php

/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController {

	/**
	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
	 */
	public $menu = array();

	/**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs = array();

	public function uniqueId() {
		$prefix = 'U'; // a universal prefix prefix 
		$my_random_id = $prefix;
		$my_random_id .= chr(rand(65, 90));
		$my_random_id .= time();
		$my_random_id .= md5(uniqid($prefix));
		
		return substr($my_random_id, 0, 16);
	}

}