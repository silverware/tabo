<script type="text/javascript">

	$(document).ready(function () {
		initPost("contact-form", function(response) {
			if (response == "ok") {
				showNotification({success: true, text: "Contact Formular successfully sent"});
				$("#contact-form")[0].reset();
				
			} else {
				showNotification({success: false, text: "Something went wrong"});
			}
		});
	});
    
</script>
<h2>Contact Us</h2>

<p>
	If you have business inquiries, feedback or other questions, please fill out the following form to contact us. Thank you.
</p>

<div class="formFields">

	<?php
	$form = $this->beginWidget('CActiveForm', array(
		'id' => 'contact-form',
			));
	?>
	<div class="cell m">
		<label>Name*</label>
	</div>
	<div class="cell end">
		<input class="xl" type="text" name="contact-form[name]" validation="required" maxlength="255" />
	</div>
	<div class="cell m">
		<label>Email*</label>
	</div>
	<div class="cell end">
		<input class="xl" type="text" name="contact-form[email]" validation="required email" maxlength="255" />
	</div>
	<div class="cell m">
	<label>Text</label>
</div>
<div class="cell end">
	<textarea class="xl" name="contact-form[text]" maxlength="500" validation="required"></textarea>
</div>
</div>

<div>
	<input type="submit" value="Send" />
</div>

<?php $this->endWidget(); ?>
