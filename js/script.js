// Author: Dan Girgenti

var Eassy = Eassy || {};

Eassy.Index = $(function() {
	// Fill the select based on whats in Eassy.Properties
	for (group in Eassy.Properties) {
		$('#add-select').append('<optgroup label="'+group+'">')
		for (prop in Eassy.Properties[group]) {
			$('optgroup[label="'+group+'"]').append('<option value="'+prop+'">'+Eassy.Properties[group][prop]+'</option>')
		}
		$('#add-select').append('</optgroup>')
	}
	$('#add-select').append('<optgroup label=""><option value="" selected>add a property</option></optgroup>')

	$('#add-select').selectpicker()
	$('[rel=tooltip]').tooltip({placement:'right',html:true})

	$(document).on('keypress', function(e) {
		if(e.which == 13) {
        $('form').trigger('change')
        e.preventDefault()
    		return false
    }
    return true
	})

	$('body').on('changeColor show hide', '.colorpicker', function(ev){
			rgbastring = Eassy.RGBObjToString(ev.color.toRGB())
			$(this).siblings('.add-on.color').css("background-color", rgbastring)
			$(this).val(rgbastring)
			setTimeout(function() {
				$('form').trigger('change')
			}, 1)
		})

	$('body').on('change', 'form', function() {
		$('.live textarea').val(Eassy.parseCSS(Eassy.getCSSJSON()))
	})

	$('form').on('click', '.add-on.unit', function() {
		if ($(this).html() == "em") $(this).html("%")
		else if ($(this).html() == "px") $(this).html("em")
		else if ($(this).html() == "%") $(this).html("px")
		$('form').trigger('change')
		return false
	})

	$('form').on('click', '.minus', function() {
		$(this).parent().fadeOut(250, function() {
			$(this).remove()
			if ($('form').trigger('change').children('.control-group').length == 1)
				$('#empty').fadeIn(200)
		})
		return false
	})

	$('body').on('click', '#plus', function() {
		val = $('#add-select').val()
		if (val == "")
			alert('You must pick a property to add')
		else {
			$('#empty').fadeOut(200, function() {
				if (!$('.'+val+'-wrap').length || val == "custom") {
					newProp = Eassy.addProperty(val, function() {
						newProp.find('[rel=tooltip]').tooltip({placement:'right',html:true})
						newProp.find('.colorpicker').colorpicker({format:"rgba"})
						newProp.find('.selectpicker').selectpicker()
					})
				} else alert('You already added that property')
			})
		}
		return false
	})
});

Eassy.alertCSS = function() {
	alert(Eassy.parseCSS(Eassy.getCSSJSON()))
}

Eassy.clearExample = function() {
	$('#test').attr('style','')
}

// Takes in a property name and a callback function
// Calls the callback when the new property is faded in
// Returns the new property's wrapper div
//
Eassy.addProperty = function(prop, callback) {
	$('form').append('<div class="control-group '+prop+'-wrap" style="display:none"></div>')
	propWrap = $('.'+prop+'-wrap')
	$.get("/control-groups/"+prop, function(data) {
		propWrap.html(data)
	})
	propWrap.fadeIn(300, function() {
		callback()
	})
	return $('.'+prop+'-wrap')
}

// Takes in an RGBA object and returns it
// as a string in rgba(r,g,b,a) format
// 
Eassy.RGBObjToString = function (rgba) {
	return "rgba(" 
		+ rgba.r + ","
		+ rgba.g + ","
		+ rgba.b + ","
		+ rgba.a + ")"
}

// Takes in a set of CSS JSON objects and an 
// optional boolean to denote SASS output 
// which defaults to false
//
// parseCSS(cssJSON[,sass])
//
Eassy.parseCSS = function (cssJSON, sass) {
	css = ""
	for (i in cssJSON) {
		css += cssJSON[i].selector
		if (!sass) css += " {"
		css += "\n"
		for (j in cssJSON[i].properties) {
			p = cssJSON[i].properties[j]
			css += "\t" + p.prop + ": " + p.attr + ";\n"
		}
		if (!sass) css += "}"
		css += "\n"
	}
	if (css == '* {\n}\n')
		return "This is where your CSS will appear"
	else
		return css
}


// Grabs all input values from given form
// and returns the JSON representation
//
Eassy.getCSSJSON = function (form) {
	selector = $('#selector').val() || "*"
	props = []
	$('input[id!=selector],.selectpicker[id!=add-select]').each(function() {
		if ($(this).val()) {
			append = $(this).siblings('.add-on.unit').html() || ""
			if ($(this).is('.selectpicker,.colorpicker')) append = ""
			if ($(this).is('.custom-attr'))
				props.push({
					"prop" : $(this).siblings('.custom-prop').val() || "undefined-custom",
					"attr" : $(this).val()
				})
			else if (!$(this).is('.custom-prop'))
				props.push({
				"prop" : $(this).attr('id'),
				"attr" : ($(this).val()!=0) ? $(this).val()+append : $(this).val()
				})
		}
	})
	return [{
		"selector" : selector,
		"properties" : props
	}]
}

// Eassy's supported properties and their
// display names, by type
//
Eassy.Properties = {
	"box properties" : {
		"background-color": "background color",
		"padding-all": "padding (#,#,#,#)",	
		"padding-one": "padding (#)",
		"margin-all": "margin (#,#,#,#)",
		"margin-one": "margin (#)",
		"border": "border",		
		"border-radius": "border radius"
	},
	"text properties" : {
		"font-family": "font",
		"font-size": "font size",
		"font-weight": "font weight",
		"color": "font color",
		"letter-spacing": "letter spacing",
		"word-spacing": "word spacing",
		"text-indent": "text indent"
	},
	"custom" : {
		"custom" : "custom"
	}
}