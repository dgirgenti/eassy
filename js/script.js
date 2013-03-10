var Eassy = Eassy || {};

Eassy.Index = $(document).ready(function() {
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
	$('form').change(function() {
		$('.live textarea').val(Eassy.parseCSS(Eassy.getCSSJSON()))
	})
	$('#units').click(function() {
		$('.add-on.unit').each(function() {
			if ($(this).html() == "em") $(this).html("px")
			else if ($(this).html() == "px") $(this).html("em")
			$(this).siblings('input').trigger('change')
		})
		return false
	})
	$('.control-group').not('.selector-wrap').each(function() {
		$(this).append('<a href="#" class="minus">x</a>')
	})
	$('.minus').on('click', function() {
		$(this).parent().remove()
		$('form').trigger('change')
		return false
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
	sass = sass || false
	css = ""
	for (i in cssJSON) {
		css += cssJSON[i].selector
		if (!sass) css += " {"
		css += "\n"
		for (j in cssJSON[i].properties) {
			p = cssJSON[i].properties[j]
			css += "\t" + p.prop + ": " + p.attr + ";\n"
			$('#test').css(p.prop,p.attr)
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
			append = $(this).siblings('.add-on.unit').html() || ""
			if ($(this).is('.selectpicker,.colorpicker')) append = ""
			props.push({
				"prop" : $(this).attr('id'),
				"attr" : $(this).val() + append
			})
		}
	})
	return [{
		"selector" : selector,
		"properties" : props
	}]
}

Eassy.Properties = [
		"selector",
		"background-color",
		"padding-all",
		"padding-one",
		"margin-all",
		"margin-one",
		"border-radius",
		"border"
]