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

	$('body').on('click', '.add-on.unit', function() {
		if ($(this).html() == "em") $(this).html("%")
		else if ($(this).html() == "px") $(this).html("em")
		else if ($(this).html() == "%") $(this).html("px")
		$('form').trigger('change')
		return false
	})

	$('body').on('click', '.minus', function() {
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
				if (!$('.'+val+'-wrap').length) {
					newProp = Eassy.addProperty(val, function() {
						newProp.find('.colorpicker').colorpicker({format:"rgba"})
						newProp.find('.selectpicker').selectpicker()
					})
				} else alert('You already added that property')
			})
		}
		return false
	})
});

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
			prepend = ""
			append = $(this).siblings('.add-on.unit').html() || ""
			if ($(this).is('.selectpicker,.colorpicker')) append = ""
			props.push({
				"prop" : $(this).attr('id'),
				"attr" : ($(this).val()!=0)?prepend+$(this).val()+append:prepend+$(this).val()
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
		"border-radius": "border radius",
		"border": "border"
	},
	"text properties" : {
		"font-size": "font size",
		"font-weight": "font weight",
		"font-family": "font",
		"color": "font color",
		"letter-spacing": "letter spacing",
		"word-spacing": "word spacing",
		"text-indent": "text indent"
	}
}