function initPost(formID, responseFunction) {
	initFormValidator(formID);
	
	$("#" + formID).submit(function(event) {

		/* stop form from submitting normally */
		event.preventDefault(); 
		if (validate(formID)) {
			
			/* get some values from elements on the page: */
			var form = $(this);
			var data =  form.serialize();

			var url = form.attr('action');

			/* Send the data using post and put the results in a div */
			$.post(url, data, responseFunction);
		} else {
			hideLoading();
			showNotification({success: false});
		}
	  });
}

function loadSite(targetId, url, loaderId) {
	$("#" + loaderId).show();
	$.get(url, function(data) {
		$('#' + targetId).html(data);
		$("#" + loaderId).hide();
	});
}

function loadTemplate(target, url, data) {
	$.get(url, function(template) {
		
		$.each(data, function(index, value) {
			template = template.replace(index, value);
			
		});
		target.append(template);
	});
}

