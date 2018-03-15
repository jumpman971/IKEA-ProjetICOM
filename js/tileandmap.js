var tileList = [];
var mapList = [];

//l'objet tile
function TileSet(name, tileHeight, tileWidth, tileFile) {
	return {'name':name, 'tileLength': {'height':tileHeight, 'width':tileWidth}, 'file':tileFile};
}

function Map(name, mapHeight, mapWidth, tile) {
	//var id = tile.id.split('-')[1];
	
	return {'name':name, 'mapSize': {'height':mapHeight, 'width':mapWidth}, 'tile':tile};
}

//tileSelector
var tileSetSelected;

function TileSelector() {
	var main = new Element('div', {'id':'tileSelector'});
	//var c = new Element('canvas', {'id':'tileSelectorCanvas', 'html':"Ce navigateurs ne supporte pas canvas. Impossible de lancer l'application."}).inject(main);
	
	var offsetX = 10;
	var maxH = 150;
	var img, w, h, x, c, div;
	
	if (tileList.length === 0) {
		new Element('div', {'html':'No TileSet'}).inject(main);
	
		return main;
	}
	
	function mouseOverTileSetHandler(e) {
		e.style = 'background-color: blue;';
	}
	
	function mouseLeaveTileSetHandler(e) {
		e.style = '';
	}
	
	function clickTileSetHandler(e) {
		/*var l = $$('canvas.tileMap');
		var elem;
		
		for (var i = 0; i < l.length; ++i) {
			elem = l[i];
			elem.target.setAttribute('data-selected', false);
		}*/
		tileSetSelected = e.target.id.split('-')[1];
		//change background color
	}
	
	for (var i = 0; i < tileList.length; ++i) {		
		div = new Element('div', {'id':'tileMap-'+i, 'class':'tileMap'}).inject(main);
		div.addEventListener('mouseover', mouseOverTileSetHandler);
		div.addEventListener('mouseleave', mouseLeaveTileSetHandler);
		div.addEventListener('click', clickTileSetHandler);
		new Element('canvas', {'id':'tileMapCanvas-'+i, 'class':'tileMap', 'data-selected':false, 'html':"Ce navigateurs ne supporte pas canvas. Impossible de lancer l'application."}).inject(div);
		img = {'id':i, 'img':new Image()};
		img.img.onload = function() { 
			w = img.img.width;
			h = img.img.height;
			getCanvas('tileMapCanvas-'+img.id).context.drawImage(img.img, 0, 0, w * (maxH/h), maxH);
			getCanvas('tileMapCanvas-'+img.id).context.save();
		}
		img.img.src = URL.createObjectURL(tileList[i].file);
	}
	
	return main;
}

//les fenetres
var divTileWin;
var tileImg = {};
var selectedTileElem = {};
var hoverTileElem = {};

/****** la fenetre de la tile ******/
//tile params
var tileMinSize = {'x':32,'y':32}
var tileMaxSize = {'x':10,'y':10}

function afficherFenetreTile(id) {
	var win = document.createElement('canvas');
	win.id = 'tilewin';
	var width = 4000;
	var height = 4000;
	//var width = 520;
	//var height = 720;
	win.width = width;
	win.height = height;
	//win.style = 'position: absolute; top: 40px; border: solid 1px; overflow: auto;';
	win.appendChild(document.createTextNode("Ce navigateurs ne supporte pas canvas. Impossible de lancer l'application."));
	divTileWin = document.createElement('div');
	divTileWin.id = 'divTileWin'
	divTileWin.style = 'width: '+520+'px; height: '+720+'px;';
	//divTileWin.style = 'width: '+520+'px; height: '+720+'px; position: absolute; top: 40px; border: solid 1px; overflow: auto;';
	divTileWin.appendChild(win);
	$('mainDivWindow').appendChild(divTileWin);
	divTileWin.addEventListener('mousemove', mouseOverTileHandler);
	divTileWin.addEventListener('click', mouseClickTileHandler);
	
	var img = new Image();
	img.onload = function() { 
		var w = img.width;
		var h = img.height;
		win.width = w;
		win.height = h;
		tileMaxSize.x = w;
		tileMaxSize.y = h;
		/*if (h > w) {
			height = h;
		}*/
		tileImg.img = img;
		tileImg.w = w;
		tileImg.h = h;
		getCanvas('tilewin').context.drawImage(img, 0, 0, w, h);
		getCanvas('tilewin').context.save();
	}
	img.src = URL.createObjectURL(tileList[id].file);
}

function refreshTileMapWin() {
	var ctx = getCanvas('tilewin').context;
	ctx.clearRect(0,0, tileImg.w, tileImg.h);
	ctx.drawImage(tileImg.img, 0, 0, tileImg.w, tileImg.h); 
	
	if (typeof selectedTileElem.x !== 'undefined') {
		ctx.beginPath();
		ctx.rect(selectedTileElem.x,selectedTileElem.y,tileMinSize.x,tileMinSize.y);
		ctx.strokeStyle = "blue";
		ctx.stroke();
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function mouseOverTileHandler(e) {
	var w = tileMinSize.x;
	var h = tileMinSize.y;
	var mouse = getMousePos(getCanvas('tilewin').canvas, e);
	var pos = {'y':0, 'x':0};
	pos.x = Math.ceil(mouse.x/tileMinSize.x);
	pos.y = Math.ceil(mouse.y/tileMinSize.y);
	//var str = "mouse x="+mouse.x+"; mouse y="+mouse.y+" ||| pos x="+pos.x+"; pos y="+pos.y;
	//console.log(str);
	hoverTileElem.x = (pos.x*tileMinSize.x)-tileMinSize.x;
	hoverTileElem.y = (pos.y*tileMinSize.y)-tileMinSize.y;
	var ctx = getCanvas('tilewin').context;
	
	refreshTileMapWin();
	ctx.beginPath();
	ctx.rect(hoverTileElem.x,hoverTileElem.y,w,h);
	ctx.strokeStyle = "black";
	ctx.stroke();
}

function mouseClickTileHandler(e) {
	//getCanvas('mapwin').context.drawImage(tileImg.img,selectedElem.x,selectedElem.y,tileMinSize.x,tileMinSize.y,10,10,tileMinSize.x,tileMinSize.y);
	var ctx = getCanvas('tilewin').context;
	
	refreshTileMapWin();
	ctx.beginPath();
	ctx.rect(hoverTileElem.x,hoverTileElem.y,tileMinSize.x,tileMinSize.y);
	ctx.strokeStyle = "blue";
	ctx.stroke();
	selectedTileElem.x = hoverTileElem.x;
	selectedTileElem.y = hoverTileElem.y;
}

/****** la fenetre de la map ******/
mapWidth = '1280';
mapHeight = '720';

var selectedMapElem = {};
var hoverMapElem = {};

var map = [];

function afficherFenetreMap(map) {
	afficherFenetreTile(map.tile);
	
	var win = document.createElement('canvas');
	win.id = 'mapwin';
	win.width = mapWidth;
	win.height = mapHeight;
	//win.style = 'position: absolute; top: 40px; left: 550px; border: solid 1px';
	//win.style = 'border: solid 1px';
	win.appendChild(document.createTextNode("Ce navigateurs ne supporte pas canvas. Impossible de lancer l'application."));
	//document.body.appendChild(win);
	$('mainDivWindow').appendChild(win);
	
	win.addEventListener('mousemove', mouseOverMapHandler);
	win.addEventListener('click', mouseClickMapHandler);
	win.addEventListener('mouseup', mouseUpHandler);
	win.addEventListener('mousedown', mouseDownHandler);
}

function refreshMapWin() {
	var ctx = getCanvas('mapwin').context;
	ctx.clearRect(0,0, mapWidth, mapHeight);
	//ctx.drawImage(tileImg.img, 0, 0, tileImg.w, tileImg.h); 
	var thisElem, fPos = {};
	
	if (map.length != 0) {
		for (var i = 0; i < map.length; ++i) {
			if (typeof map[i] !== 'undefined') {				
				for (var j = 0; j < map[i].length; ++j) {
					if (typeof map[i][j] !== 'undefined') {
						thisElem = map[i][j];
						fPos.x = (i*tileMinSize.x)-tileMinSize.x;
						fPos.y = (j*tileMinSize.y)-tileMinSize.y;
						getCanvas('mapwin').context.drawImage(tileImg.img,thisElem.x,thisElem.y,tileMinSize.x,tileMinSize.y,fPos.x,fPos.y,tileMinSize.x,tileMinSize.y);
					}
				}
			}
		}
	}
}

function mouseOverMapHandler(e) {
	var w = tileMinSize.x;
	var h = tileMinSize.y;
	var mouse = getMousePos(getCanvas('mapwin').canvas, e);
	var pos = {'y':0, 'x':0};
	pos.x = Math.ceil(mouse.x/tileMinSize.x);
	pos.y = Math.ceil(mouse.y/tileMinSize.y);
	//var str = "mouse x="+mouse.x+"; mouse y="+mouse.y+" ||| pos x="+pos.x+"; pos y="+pos.y;
	//console.log(str);
	hoverMapElem.x = (pos.x*tileMinSize.x)-tileMinSize.x;
	hoverMapElem.y = (pos.y*tileMinSize.y)-tileMinSize.y;
	var ctx = getCanvas('mapwin').context;
	
	refreshMapWin();
	ctx.beginPath();
	ctx.rect(hoverMapElem.x,hoverMapElem.y,w,h);
	ctx.strokeStyle = "black";
	ctx.stroke();
	
	if (isClicked) {
		addSelectedTile(e);
	}
	//getCanvas('mapwin').context.drawImage(tileImg.img,selectedElem.x,selectedElem.y,tileMinSize.x,tileMinSize.y,pos.x,pos.y,tileMinSize.x,tileMinSize.y);
}

var isClicked = false;

function mouseDownHandler(e) {
	if (isLeftMouseBp)
		isClicked = true;
}

function mouseUpHandler(e) {
	if (isLeftMouseBp)
		isClicked = false;
}

function mouseClickMapHandler(e) {
	addSelectedTile(e);
}

function addSelectedTile(e) {
	var w = tileMinSize.x;
	var h = tileMinSize.y;
	var mouse = getMousePos(getCanvas('mapwin').canvas, e);
	var pos = {'y':0, 'x':0};
	var fPos = {'y':0, 'x':0};
	pos.x = Math.ceil(mouse.x/tileMinSize.x);
	pos.y = Math.ceil(mouse.y/tileMinSize.y);
	//var str = "mouse x="+mouse.x+"; mouse y="+mouse.y+" ||| pos x="+pos.x+"; pos y="+pos.y;
	//console.log(str);
	
	fPos.x = (pos.x*tileMinSize.x)-tileMinSize.x;
	fPos.y = (pos.y*tileMinSize.y)-tileMinSize.y;
	var ctx = getCanvas('mapwin').context;
	
	/*refreshTileMapWin();
	ctx.beginPath();
	ctx.rect(hoverElem.x,hoverElem.y,w,h);
	ctx.strokeStyle = "black";
	ctx.stroke();*/
	if (typeof map[pos.x] === 'undefined')
		map[pos.x] = [];
	//map[pos.x][pos.y] = Object.assign(selectedTileElem);
	map[pos.x][pos.y] = JSON.parse(JSON.stringify(selectedTileElem));
	
	getCanvas('mapwin').context.drawImage(tileImg.img,selectedTileElem.x,selectedTileElem.y,tileMinSize.x,tileMinSize.y,fPos.x,fPos.y,tileMinSize.x,tileMinSize.y);
}

function isLeftMouseBp(evt) {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons == 1;
    }
    var button = evt.which || evt.button;
    return button == 1;
}

/*
function ajouteElement() {
  // crée un nouvel élément div
  // et lui donne un peu de contenu
  const nouveauDiv = document.createElement("div");
  const nouveauContenu = document.createTextNode("Salutations !");
  nouveauDiv.appendChild(nouveauContenu) //ajoute le contenu au div
  
  // ajoute l'élément qui vient d'être créé et son contenu au DOM
  const divActuel = document.getElementById("div1");
  document.body.insertBefore(nouveauDiv, currentDiv);
}*/