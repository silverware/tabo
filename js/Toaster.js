function openToaster(success, message) {

	if (message == undefined) {
		if (success) {
			message = "Daten erfolgreich gespeichert.";
		} else {
			message = "Daten konnten nicht gespeichert werden.";
		}
	}
	$("body").append($("<div></div>").attr("id", "toaster"));
	$("#toaster").empty();
	$("#toaster").append(message);
	if (!success) {
		$("#toaster").css("background-color", "#E20D0D");
	} else {
		$("#toaster").css("background-color", "green");
	}
	$("#toaster").slideDown().delay(4000).fadeOut();
	
}

function showLoading() {
	$.blockUI({
            theme:     true,
            title:    'LOADING',
            message:  '<div class="loadingMessage">Please Wait...</div>'
        });
}
	
function hideLoading() {
	$.unblockUI();
}

function showNotification(params) {
	
	var success = params.success != undefined ? params.success : true;
	var text;
	if (success) {
		text = params.text ? params.text : "Saved successfully";
	} else {
		text = params.text ? params.text : "The inputs are not valid";
	}
	
	var right = ($(window).width() - $("#content").width()) / 2;
	var top = $("#header").height() + 20;
	$.blockUI({ 
            message: text, 
            fadeIn: 700, 
            fadeOut: 700, 
            timeout: 3000, 
            showOverlay: false, 
            centerY: false, 
            css: { 
                width: '350px', 
                top: top + 'px', 
                left: '', 
                right: right + 'px', 
                border: 'none',
				borderRadius: '4px',
                padding: '5px', 
                backgroundColor: '#000', 
                opacity: .6, 
                color: '#fff' 
            } 
        }); 
}