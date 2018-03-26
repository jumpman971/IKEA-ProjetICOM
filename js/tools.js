/****** Fonction Canvas ******/
function getCanvas(canvasName) {
	var canvas = document.getElementById(canvasName);
    if(!canvas) {
        alert("Impossible de récupérer le canvas");
        return null;
    }

    var context = canvas.getContext('2d');
    if(!context) {
        alert("Impossible de récupérer le context du canvas");
        return null;
    }
	
	return {"canvas": canvas, "context": context}
}

function inject (elem) {
	elem.appendChild(this);
	
	return this;
}

//document.addEventListener('DOMContentLoaded', function() {
	HTMLElement.prototype.inject = inject
//});

function $(name) {
	return document.getElementById(name);
}

function $$(name) {
	return document.querySelectorAll(name);
}

function Element(type, parameter) {
	var r = document.createElement(type);
	
	for (param in parameter) {
		if (param === 'html')
			r.innerHTML = parameter[param];
		else if (param === 'class')
			r.setAttribute(param, parameter[param]);
		else
			r[param] = parameter[param];
	}
	
	return r;
}