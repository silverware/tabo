<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />

        <!--[if lt IE 8]>
        <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
        <![endif]-->
        <?php
        $baseURL = Yii::app()->baseUrl;
        ?>

        <link rel="stylesheet" type="text/css" href="<?php echo $baseURL; ?>/css/main.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo $baseURL; ?>/css/form.css" />
        <link type="text/css" href="<?php echo $baseURL; ?>/css/redmond/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
        <link href="<?php echo $baseURL; ?>/css/tacticBoard.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="<?php echo $baseURL; ?>/js/lib/selectmenu/ui.selectmenu.css" type="text/css" />

        <?php
        Yii::app()->clientScript->registerScriptFile('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js')
                ->registerScriptFile('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js')
                ->registerScriptFile($baseURL . '/js/lib/selectmenu/jquery.ui.selectmenu.js')
                ->registerScriptFile($baseURL . '/js/lib/fabric/dist/all.js')
                ->registerScriptFile($baseURL . '/js/lib/fabric/lib/fonts/Delicious_500.font.js')
                ->registerScriptFile($baseURL . '/js/lib/fabric/lib/fonts/CrashCTT_400.font.js')
                ->registerScriptFile($baseURL . '/js/lib/jquery.blockUI.js')
                ->registerScriptFile($baseURL . '/js/lib/jquery.tablednd_0_5.js')
                ->registerScriptFile($baseURL . '/js/tacticBoardApp.js')
                ->registerScriptFile($baseURL . '/js/SendRequest.js')
                ->registerScriptFile($baseURL . '/js/FormValidator.js')
                ->registerScriptFile($baseURL . '/js/Toaster.js')
                ->registerScriptFile($baseURL . '/js/main.js');
        ?>

        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
    </head>

    <body>
        <div style="height: 43px">
            <div id="header">
                <div id="header_center">
                    <a class="noDecoration" href="<?php echo Yii::app()->createUrl('/site/index'); ?>"><div id="logo"><?php echo CHtml::encode(Yii::app()->name); ?></div></a>
                    <div id="searchForm">
                        <span class="input-holder">
                            <input type="text" id="suche" value="<?php if (isset($_GET["search"])) echo $_GET["search"] ?>" />
                            <button onclick="window.location.href = '<?php echo Yii::app()->createUrl('/site/search'); ?>' + '&search=' + $('#suche').val();">Suchen</button>
                        </span>

                    </div>
                    <?php
                    if (isset(Yii::app()->user->nutzername)) {
                        ?>
                        <div class="login_links">
                            <?php echo CHtml::link(Yii::app()->user->nutzername, Yii::app()->createUrl('/user/profileOverview')); ?>
                        </div>			
                        <?php
                    } else {
                        ?>
                        <div class="login_links">
                            <?php echo CHtml::link("Login", Yii::app()->createUrl('/site/login')); ?>
                        </div>
                    <?php } ?>
                    <div class="login_links">
                        <?php
                        echo CHtml::link("Contact Us", Yii::app()->createUrl('/site/contact'));
                        ?>
                    </div>
                    <div class="login_links">
                        <?php echo CHtml::link("Create Tactic Board", Yii::app()->createUrl('/board/createBase')); ?>
                    </div>
                </div>
            </div>
        </div>
        <div id="content">
            <?php echo $content; ?>
        </div>
        <div id="footer">
            Copyright &copy; <?php echo date('Y'); ?> by XAGA Coorporation.<br/>
            All Rights Reserved.<br/>
        </div><!-- footer -->
    </body>
</html>