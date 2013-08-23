$('document').ready(function() {
	


	window.onresize = arrangeBottom;
	arrangeBottom();
	// Zebra Tabelle erstellen
	setZebraTables();
	initTips();
	$("input:submit").button();
	
	$("input").each(function() {
		if ($(this).attr('defaultValue') !== undefined && $(this).val() == '') {
			$(this).val($(this).attr('defaultValue'));
			$(this).css("color", "#c0c0c0");
		}
	});
	$("input").focus(function(){
		if ($(this).attr('defaultValue') !== undefined) {
			if ($(this).val() == $(this).attr('defaultValue')) {
				$(this).val('');
			}
			$(this).css("color", "#505050");
		}
	});
	
	$("input").blur(function(){
		if ($(this).attr('defaultValue') !== undefined) {
			if ($(this).attr('value') == '') {
				$(this).val($(this).attr('defaultValue'));
				$(this).css("color", "#c0c0c0");
			}
		}
	});
	
//	// H�he des Main divs erh�hen, um es auf die H�he der Module zu bringen
//	var modulesHeight = 0;
//	$(".modul").each(function() {
//		modulesHeight += $(this).height();
//	});
//	if ($("#main").height() < modulesHeight) {
//		$("#main").height(modulesHeight);
//	}
});

function setZebraTables() {
	// Zebra Tabelle erstellen
	$(".zebra tr:nth-child(odd)").css("backgroundColor", "#f1f1f1")
								.css("border-top", "1px solid #c0c0c0")
								.css("border-bottom", "1px solid #c0c0c0");
	
	$(".zebra tr:nth-child(odd)").mouseover(function(event) {
		$(this).css("backgroundColor", "#E7E6E6");
	});
	$(".zebra tr:nth-child(odd)").mouseout(function(event) {
		$(this).css("backgroundColor", "#f1f1f1");
	});
	$(".zebra tr:nth-child(even)").mouseover(function(event) {
		$(this).css("backgroundColor", "#E7E6E6");
	});
	$(".zebra tr:nth-child(even)").mouseout(function(event) {
		$(this).css("backgroundColor", "white");
	});
	
}

function initTips() {
	$(".tip").each(function() {
		$(this).prepend($("<div><img src='img/icon/lightbulb.png' height='20px'></div>"));
	});
}

function arrangeBottom() {
	
    var winHeight = $(window).height();
    var pageHeight = $('#content').height();
    var heightDiff = winHeight - pageHeight;
    if (heightDiff - 130 > 0) {
        $('#footer').css('bottom', 0);
		$('#footer').css('position', 'absolute');
    } else {
        $('#footer').css('position', 'relative');
    } 
}


MIN_TEXTWIDTH = 10
WIDTH_OFFSET = 5

$.fn.editable = function(onChange) {  
	return this.each(function() {
        var textField = $(this);
		textField.mouseover(function() {
			textField.removeClass("invisible");
		});
        $(this).mouseout(function() {
            textField.addClass("invisible");
        });

		textField.click(function() {
            textField.addClass("editable");
			textField.css({width: textWidth(textField.val()) + WIDTH_OFFSET});
			textField.keyup(function() {
				if (textWidth(textField.val()) > MIN_TEXTWIDTH) {
					textField.css({width: textWidth($(this).val()) + WIDTH_OFFSET});
				}
				if (onChange) {
					onChange(textField.val());
				}
			});
            textField.keypress(function() {
				if (textWidth(textField.val()) > MIN_TEXTWIDTH) {
					textField.css({width: textWidth($(this).val()) + WIDTH_OFFSET});
				}
			});
            textField.blur(function() {
				textField.addClass("invisible");
                textField.removeClass("editable");
            });

			textField.keydown(function(event) {
				if (event.keyCode == 9) {
					textField.blur();
				}
			});
			textField.focus();
		});
	});
};

function textWidth(text) {
    var sensor = $('<label>').css({margin: 0, padding: 0});
    $("body").append(sensor);
    sensor.append(text);
    var width = sensor.width();
    sensor.remove();
    return width;
  };
