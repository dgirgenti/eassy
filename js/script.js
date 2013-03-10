var Eassy = Eassy || {};

Eassy.Index = $(document).ready(function() {
	$('.colorpicker').colorpicker({format:"rgba"})
		.on('changeColor', function(ev){
	  	$(this).val(Eassy.RGBObjToString(ev.color.toRGB()))
		});
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

Eassy.getCSSJSON = function (form) {
		selector = $('#selector').val()
		/* 
		return [
		{
			"selector" : "body",
			"properties" : [
				{ 
					"prop" : "font-family", 
					"attr" : "Arial, sans-serif"
				},
				{
					"prop" : "color",
					"attr" : "#333333"
				}
			]
		},
		{
			"selector" : "div.box",
			"properties" : [
				{ 
					"prop" : "background-color", 
					"attr" : "#ae9ea2"
				},
				{
					"prop" : "border-radius",
					"attr" : "3px"
				}
			]
		}
	] */
}