<script type="text/javascript">

$(document).ready(function () {
	 initPost("form", function(response) {
		 if (response == "ok") {
			 showNotification({success: true});
			 $("#pw1").val("");
			 $("#pw2").val("");
			 $("#pw3").val("");
		 } else {
			 showNotification({success: false, text: response});
		 }
	 });
});
    
</script>
<h3>Change Password</h3>

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'form',
)); ?>

<div class="formFields">
<div class="cell l">
	<label>Old Password*</label>
</div>
<div class="cell end">
	<input class="xl" type="password" id="pw1" name="form[oldPassword]" validation="required" maxlength="255" />
</div>
<div class="cell l">
	<label for="passwort">New Password*</label>
</div>
<div class="cell end">
	<input class="xl" type="password" id="pw2" name="form[newPassword]" validation="required" maxlength="255" />
</div>
<div class="cell l">
	<label for="passwort">Repeat New Password*</label>
</div>
<div class="cell end">
	<input class="xl" type="password" id="pw3" name="form[newPassword2]" validation="required" maxlength="255" />
</div>
</div>

<div class="row buttons">
	<input type="submit" value="Save" />
</div>

<?php $this->endWidget(); ?>