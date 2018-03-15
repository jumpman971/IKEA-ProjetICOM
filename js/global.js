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

var Point2D = {x: 0, y: 0};

var winH, winW;
winW = 640;
winH = 480;

var memoryOf2DObject = [];				//Liste d'objet 2D créé dans la map actuel, permet de les réaffichés automatiquement lorsqu'il y a changement de position de l'oeil
var oldX, oldY;
oldX = 0;
oldY = 0;

mapMove = false;

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

function inject (elem) {
	elem.appendChild(this);
	
	return this;
}

document.addEventListener('DOMContentLoaded', function() {
	HTMLElement.prototype.inject = inject
});

/***** MenuBar Buttons *****/

function openNewMapPopup() {
	var c = new Element('div', {'id':'newMapWin'});
		var mapName = new Element('div', {'id':'mapName', 'class':'container'}).inject(c);
			new Element('label', {'for':'mapName', 'html':'Map Name'}).inject(mapName);
			new Element('input', {'id':'inputMapName', 'name':'mapName', 'type':'text'}).inject(mapName);
			
		var mapSize = new Element('div', {'id':'mapSize', 'class':'container'}).inject(c);
			var div2 = new Element('div', {'id':'mapSizeLabel', 'html':'Map Size'}).inject(mapSize);
			div2 = new Element('div', {'id':'subDivMapSize'}).inject(mapSize);
				var line = new Element('div', {'id':'mapHeightDiv'}).inject(div2);
					new Element('label', {'for':'mapHeight', 'html':'Map Height'}).inject(line);
					new Element('input', {'id':'inputMapHeight', 'name':'mapHeight', 'type':'text'}).inject(line);
				line = new Element('div', {'id':'mapWidthDiv'}).inject(div2);
					new Element('label', {'for':'mapWidth', 'html':'Map Width'}).inject(line);
					new Element('input', {'id':'inputMapWidth', 'name':'mapWidth', 'type':'text'}).inject(line);
					
		//tile selector		
		new TileSelector().inject(c);

		//buttons
		var div = new Element('div', {'id':'buttons'}).inject(c);
			var bp = new Element('input', {'type':'button','value':'Cancel'}).inject(div).addEventListener('click', function(e) {
				$('popup').remove();
			});
			var bp = new Element('input', {'type':'button','value':'Validate'}).inject(div).addEventListener('click', function(e) {
				//create and open new map
				var m = new Map($('inputMapName').innerHTML, $('inputMapHeight').innerHTML, $('inputMapWidth').innerHTML, tileSetSelected);
				mapList.push(m);
				$('popup').remove();
				afficherFenetreMap(m);
			});
	
	new Popup('New Map', c);
}

function openNewTilePopup() {
	var main = new Element('div', {'id':'newTileWin'});
		var div = new Element('div', {'id':'tileNameContainer'}).inject(main);
			new Element('label', {'for':'tileNameInput', 'html':'TileSet Name'}).inject(div);
			new Element('input', {'id':'tileNameInput', 'type':'text'}).inject(div);
			
		div = new Element('div', {'id':'tileLengthContainer'}).inject(main);
			var div2 = new Element('div', {'id':'labelTileLength', 'html':'Tile Length'}).inject(div);
			div2 = new Element('div', {'id':'subDivTileLength'}).inject(div);
				var line = new Element('div', {'id':'tileHeightDiv'}).inject(div2);
					new Element('label', {'for':'tileHeightInput', 'html':'Tile Height'}).inject(line);
					new Element('input', {'id':'tileHeightInput', 'type':'text'}).inject(line);
				line = new Element('div', {'id':'tileWidthDiv'}).inject(div2);
					new Element('label', {'for':'tileWidthInput', 'html':'Tile Width'}).inject(line);
					new Element('input', {'id':'tileWidthInput', 'type':'text'}).inject(line);
		
		var div = new Element('div', {'id':'tileSetFile'}).inject(main);
			new Element('label', {'for':'tileSetPath', 'html':'TileSet Path'}).inject(div);
			new Element('input', {'id':'tileSetPathInput', 'type':'file'}).inject(div);
			
		div = new Element('div', {'id':'buttons'}).inject(main);
			var bp = new Element('input', {'type':'button','value':'Cancel'}).inject(div).addEventListener('click', function(e) {
				$('popup').remove();
			});
			var bp = new Element('input', {'type':'button','value':'Validate'}).inject(div).addEventListener('click', function(e) {
				tileList.push(new TileSet($('tileNameInput').innerHTML, $('tileHeightInput').innerHTML, $('tileWidthInput').innerHTML, $('tileSetPathInput').files[0]));
				$('popup').remove();
				new PopupMsg('New Tile', 'New Tile successfully created!');
			});
	
	new Popup('New Tile', main);
}

function openCharMenu() {
	var main = new Element('div', {'id':'charWin'});
		var div = new Element('div', {'id':'leftDiv'}).inject(main);
			var s = new Element('select', {'id':'selectChar', 'size':'8', 'style':"height: 160px; width: 200px; visibility: visible;"}).inject(div);
				new Element('option', {'value':'0', 'html':'Batman'}).inject(s);
			
		div = new Element('div', {'id':'rightDiv'}).inject(main);
			new Element('label', {'for':'charNameInput', 'html':'Character Name'}).inject(line);
			new Element('input', {'id':'charNameInput', 'name':'charNameInput', 'type':'text'}).inject(line);
		
		//charset selector
		//new CharSetSelector().inject(main);
		
		//skill creator
		
		div = new Element('div', {'id':'buttons'}).inject(main);
			var bp = new Element('input', {'type':'button','value':'Cancel'}).inject(div).addEventListener('click', function(e) {
				$('popup').remove();
			});
			var bp = new Element('input', {'type':'button','value':'Validate'}).inject(div).addEventListener('click', function(e) {
				tileList.push(new TileSet($('tileNameInput').innerHTML, $('tileHeightInput').innerHTML, $('tileWidthInput').innerHTML, $('tileSetPathInput').files[0]));
				$('popup').remove();
				new PopupMsg('New Tile', 'New Tile successfully created!');
			});
	
	new Popup('Character Menu', main);
}