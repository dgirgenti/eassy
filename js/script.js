var Eassy = Eassy || {};

Eassy.Index = $(document).ready(function() {
	$('.colorpicker').colorpicker({format:"rgba"})
		.on('changeColor', function(ev){
			rgbastring = Eassy.RGBObjToString(ev.color.toRGB())
			$(this).siblings('.add-on').css("background-color", rgbastring)
			$(this).val(rgbastring)
			$(this).trigger('change')
		})
	$('form').change(function() {
		$('.live textarea').val(Eassy.parseCSS(Eassy.getCSSJSON()))
	})
	//console.log(Eassy.parseCSS(Eassy.getCSSJSON()))
	//console.log(Eassy.parseCSS(Eassy.getCSSJSON(),true))
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
	$('input[id!=selector]').each(function() {
		if ($(this).val()) {
			append = $(this).siblings('.add-on:last-child').html() || ""
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