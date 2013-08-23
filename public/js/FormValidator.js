function checkName(input) {
	var regex = new RegExp("^[A-ZÖÄÜ][a-zäöüß]+$");
	return inputCorrect(regex, input);
}

function checkEmail(input) {
	var regex = new RegExp("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$");
	return inputCorrect(regex, input);
};

function checkRequired(input) {
	var regex = new RegExp(".+");
	return inputCorrect(regex, input);
};


function checkTelefon(input) {
	var regex = new RegExp("^[0-9]{0,5}/?[0-9]+$");
	return inputCorrect(regex, input);
};

function isRequired(input) {
	var regex = new RegExp(".+");
	return jQuery.trim(input.val()).match(regex);
};

function inputCorrect(regex, input) {
	var requiredSuccess = true;
	if (input.attr("validation").search("required") != -1) {
		requiredSuccess = isRequired(input);
	}
	var trimmed = jQuery.trim(input.val());
	var success = trimmed.match(regex) || trimmed == "";
	if (success && requiredSuccess) {
		input.css("border", "1px solid #79B7E7");
	} else {
		input.css("border", "1px solid #D27171");
	}
	return success && requiredSuccess;
}

function initFormValidator(/*String*/ formID) {
	$("#" + formID).find(":[validation*=name]").blur(function(event) {
		var $input = $(event.target);
		checkName($input);
	});

	$("#" + formID).find(":[validation*=email]").blur(function(event) {
		var $input = $(event.target);
		checkEmail($input);
	});
	
	$("#" + formID).find(":[validation=required]").blur(function(event) {
		var $input = $(event.target);
		checkRequired($input);
	});

	$("#" + formID).find(":[validation*=telefon]").blur(function(event) {
		var $input = $(event.target);
		checkTelefon($input);
	});
}

function allValid(inputs, checkMethod) {
	var valid = true;
	inputs.each(function(index) {
		if (!checkMethod($(this))) {
			valid = false;
		}
	});
	return valid;
}

function validate(/* String */ formID) {
	var nValid = allValid($("#" + formID).find(":[validation*=name]"), checkName);
	var eValid = allValid($("#" + formID).find(":[validation*=email]"), checkEmail);
	var rValid = allValid($("#" + formID).find(":[validation=required]"), checkRequired);
	var tValid = allValid($("#" + formID).find(":[validation*=telefon]"), checkTelefon);
	return (nValid && eValid && rValid && tValid);
}


