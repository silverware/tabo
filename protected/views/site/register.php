<script type="text/javascript">

$(document).ready(function () {
	 initPost("registerForm", function(response) {
		 if (response == "ok") {
			 $("#registerForm").empty();
			 $("#result").html("Die Registrierung war erfolgreich. Per Email wurde Dir dein Passwort zugesandt.")
		 } else {
			 showNotification({text: "The Username or Email is still in use"});
		 }
	 });
});
    
</script>
<h3>Register</h3>

<p id="result">Please fill out the following form</p>

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'registerForm',
)); ?>

<div class="formFields">
<div class="cell m">
	<label for="email">Email*</label>
</div>
<div class="cell end">
	<input class="xl" type="text" name="registerForm[email]" validation="required email" maxlength="255" />
</div>
<div class="cell m">
	<label for="nutzername">Username*</label>
</div>
<div class="cell end">
	<input class="xl" type="text" name="registerForm[nutzername]" validation="required" maxlength="255" />
</div>
</div>

<div class="row buttons">
	<input type="submit" value="Register" />
</div>

<?php $this->endWidget(); ?>