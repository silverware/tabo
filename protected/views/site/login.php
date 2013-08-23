<script type="text/javascript">

$(document).ready(function () {
	 initPost("loginForm", function(response) {
		 if (response == "ok") {
			 window.location.href = "<?php echo Yii::app()->createUrl("user/profileOverview") ?>";
		 } else {
			 showNotification({success: false, text: "Invalid Login Credentials"});
		 }
	 });
});
    
</script>
<h3>Login</h3>

<p>Please fill out the following form with your login credentials:</p>

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'loginForm',
)); ?>

<div class="formFields">
<div class="cell m">
	<label for="email">Email*</label>
</div>
<div class="cell end">
	<input class="xl" type="text" name="loginForm[email]" validation="required email" maxlength="255" />
</div>
<div class="cell m">
	<label for="passwort">Passwort*</label>
</div>
<div class="cell end">
	<input class="xl" type="password" name="loginForm[passwort]" validation="required" maxlength="255" />
</div>
</div>

<div class="row buttons">
	<input type="submit" value="Login" />
</div>

<?php $this->endWidget(); ?>

<div class="info">
<h3>You are not registered?</h3>
<a href="<?php echo Yii::app()->createUrl("site/register") ?>">Register Now</a>

</div>