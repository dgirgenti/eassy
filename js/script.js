var Eassy = Eassy || {};

Eassy.Index = $(document).ready(function() {
	for (i in Eassy.Properties) {
		Eassy.classHTML[Eassy.Properties[i]] = $('.'+Eassy.Properties[i]+'-wrap').html().replace(/\t/g, "")
		$('.live textarea').val($('.live textarea').val() + "\n'" + Eassy.Properties[i] + "\' : \'" 
			+ Eassy.classHTML[Eassy.Properties[i]] + "\'")
	}
	
	$('.selectpicker').selectpicker({
		size: 4
	})

	$('.colorpicker').colorpicker({format:"rgba"})
		.on('changeColor show hide', function(ev){
			rgbastring = Eassy.RGBObjToString(ev.color.toRGB())
			$(this).siblings('.add-on.color').css("background-color", rgbastring)
			$(this).val(rgbastring)
			$(this).trigger('change')
		})

	$('form').on('change', function() {
		$('.live textarea').val(Eassy.parseCSS(Eassy.getCSSJSON()))
	})

	$('.add-on.unit').on('click', function() {
		if ($(this).html() == "em") $(this).html("%")
		else if ($(this).html() == "px") $(this).html("em")
		else if ($(this).html() == "%") $(this).html("px")
		$('form').trigger('change')
		return false
	})

	$('.control-group').not('.selector-wrap').each(function() {
		$(this).append('<a href="#" class="minus"><i class="icon-remove-sign"></i></a>')
	})

	$('.minus').on({
		click: function() {
			$(this).parent().remove()
			$(this).parent().children('')
			$('form').trigger('change')
			return false
		},
		mouseenter: function () {
			$(this).html('<i class="icon-remove-circle"></i>')
		},
		mouseleave: function () {
		$(this).html('<i class="icon-remove-sign"></i>')
		}
	})
});

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
	$('input[id!=selector],.selectpicker').each(function() {
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

Eassy.classHTML = {}

Eassy.Properties = [
	"selector",
	"background-color",
	"padding-all",	
	"padding-one",
	"margin-all",
	"margin-one",
	"border-radius",
	"border",
	"font-size",
	"font-weight",
	"font-family",
	"color",
	"letter-spacing",
	"word-spacing",
	"text-indent"
]