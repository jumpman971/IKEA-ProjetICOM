var room;
var furnitures = [];
//un meuble = cases [{coordonnées, meuble(pere)},...]

/*****************************************/
/************* CONSTRUCTEURS *************/
/*****************************************/

/*
 * Constructeur Room
 * Description: Instancie un objet de type 'room', qui correspond à la salle à aménager.
 * 
 * metreCarre: taille en mètre carré de la salle (1m² => 1case)
 *
 * retourne: une salle de type 'Room'
 */
function Room(metreCarre) {
	var tab = [];
	for (var i = 0; i < metreCarre; ++i) {
		tab[i] = [];
		for (var j = 0; j < metreCarre; ++j)
			tab[i][j] = new CaseRoom();
	}
	
	return {taille: metreCarre, empty: true, tableau: tab};
}

function CaseRoom(x, y, x0, y0, meuble) {
	return {'x':x, 'y': y, 'x0': x0, 'y0':y0, 'meuble': meuble};
}

/*
 * Constructeur CaseRoom
 * Description: Instancie un objet de type 'caseRoom', qui correspond à un emplacement d'1m² dans la salle.
 * 
 * x: position horizontal (en m²) de l'emplacement 0 (de la première case) du meuble dans la salle
 * y: position vertical (en m²) de l'emplacement 0  (de la première case) du meuble dans la salle
 * x0: position horizontal (en m²) d'une partie du meuble
 * y0: position vertical (en m²) d'une partie du meuble
 * meuble: un meuble de type 'furniture'
 *
 * retourne: une case de la salle de type 'CaseRoom'
 */
function CaseRoom(x, y, x0, y0, meuble) {
	return {'x':x, 'y': y, 'x0': x0, 'y0':y0, 'meuble': meuble};
}

/*
 * Constructeur Furniture
 * Description: Instancie un objet de type 'furniture', qui correspond à un meuble.
 * 
 * nom: nom du meuble
 * forme: forme du meuble qui est un tableau 2D booléen (ou d'entier) où une case vide est 0, sinon 1
 *
 * retourne: un meuble de type 'Furniture'
 */
function Furniture(nom, forme) {
	var f = {
		'name': nom, 
		'shape': forme, 
		'shapeToHtml': shapeToHtml, 
		'caseToTdAt': caseToTdAt, 
		'collideInRoom': collideInRoom
	};
	
	/*
	 * Fonction shapeToHtml
	 * Description: Convertie le meuble en un tableau html correspondant à l'aspect du meuble.
	 *
	 * retourne: un objet html de type 'table'
	 */
	function shapeToHtml() {
		var table = new Element('table');
		for (var i = 0; i < f.shape.length; ++i) {
			var tr = new Element('tr').inject(table);
			for (var j = 0; j < f.shape[i].length; ++j) {
				caseToTdAt(j, i).inject(tr);
			}
		}
		return table;
	}
	
	/*
	 * Fonction caseToTdAt
	 * Description: Convertie une case de coordonnées x/y du meuble en un objet html de type 'td'.
	 *
	 * x: coordonnées horizontal d'une partie du meuble.
	 * y: coordonnées vertical d'une partie du meuble.
	 *
	 * retourne: un objet html de type 'td'
	 */
	function caseToTdAt(x, y) {
		var td = new Element('td');
		var src = "images/meuble/";
		//si coté nord/ouest
		if (y===0 && x === 0)
			src += "case-nord_ouest";
		//si coté nord/est
		else if (y===0 && x === f.shape[y].length-1)
			src += "case-nord_est";
		//si coté sud/ouest
		else if (y===f.shape.length-1 && x === 0)
			src += "case-sud_ouest";
		//si coté sud/est
		else if (y===f.shape.length-1 && x === f.shape[y].length-1)
			src += "case-sud_est";
		//si coté nord
		else if (y===0 && (x !== f.shape[y].length-1 && x !== 0))
			src += "case-nord";
		//si coté ouest
		else if ((y !== f.shape.length-1 && y !== 0) && x===0)
			src += "case-ouest";
		//si coté est
		else if ((y !== f.shape.length-1 && y !== 0) && x===f.shape[y].length-1)
			src += "case-est";
		//si coté sud
		else if (y===f.shape.length-1 && (x !== f.shape[y].length-1 && x !== 0))
			src += "case-sud";
		//sinon pièce milieu (ou pas)
		else
			src = "";
		
		if (f.shape[y].charAt(x)==="1")
			new Element('img', {'class':'caseMeuble', 'src':src+".png"}).inject(td);
		//else
			//new Element('img', {'class':'caseVide', 'src':"images/meuble/case-vide.png"}).inject(td);
		return td;
	}
	
	/*
	 * Fonction collideInRoom
	 * Description: Vérifie si le meuble, au coordonnées x/y, entre en collision avec un autre meuble dans la salle.
	 *
	 * x: coordonnées horizontal du meuble dans la salle.
	 * y: coordonnées vertical du meuble dans la salle.
	 *
	 * retourne: 'true' si il entre en collision avec un autre meuble, sinon 'false'
	 */
	function collideInRoom(x, y) {
		var x2, y2;
		for (var i = 0; i < f.shape.length; ++i) {
			y2 = y + i;		
			for (var j = 0; j < f.shape[i].length; ++j) {
				x2 = x + j;
				var td = f.caseToTdAt(j, i);
				if ((typeof room.tableau[y2][x2] !== 'undefined' && typeof room.tableau[y2][x2].meuble !== 'undefined') && typeof td.getElementsByClassName('caseMeuble')[0] !== 'undefined')
					return true;
			}
		}
		return false;
	}
	
	return f;
}

/*************************************/
/************* EVENEMENT *************/
/*************************************/
document.addEventListener('DOMContentLoaded', function() {
	/*$$('#cmdContainer input')[0].addEventListener('keydown', function onInputCmdKeyPress(e) {
		if (e.keyCode == 13) //on appui sur la touche entrer
			sendCmd(e.target.value);
	});*/
});

/*********************************************/
/************* FONCTIONS GENERAL *************/
/*********************************************/

/*
 * Fonction loadFurniture
 * Description: Instancie et ajoute un objet de type 'furniture' dans les accessoires.
 * 		L'affichage est rafraichie automatiquement.
 *
 * nom: nom du meuble
 * forme: forme du meuble qui est un tableau 2D booléen (ou d'entier) où une case vide est 0, sinon 1
 */
function loadFurniture(nom, forme) {
	furnitures.push(new Furniture(nom, forme));
	refreshFurnitureView();
}

/*
 * Fonction getFurnitureByName
 * Description: Cherche et récupère un meuble par rapport à son nom
 *
 * nom: nom du meuble
 *
 * retourne: meuble de type Furniture
 */
function getFurnitureByName(nom) {
	for (var i = 0; i < furnitures.length; ++i) {
		if (furnitures[i].name === nom)
			return furnitures[i];
	}
	return null;
}

/*
 * Fonction addFurnitureToRoom
 * Description: Ajoute un meuble de type 'furniture' dans la salle aux coordonnées x y.
 * 		L'affichage est rafraichie automatiquement.
 *
 * nomMeuble: nom d'un meuble.
 * x: coordonnées horizontal dans la salle.
 * y: coordonnées vertical dans la salle.
 */
function addFurnitureToRoom(nomMeuble, x, y) {
	var meuble = getFurnitureByName(nomMeuble);
	var x2, y2;
	//d'abord, tester qu'il n'y a pas de meuble à l'emplacement
	if (meuble.collideInRoom(x, y)) {
		addLog("Le meuble à ajouter est en collision avec un autre");
		return;
	}
		
	for (var i = 0; i < meuble.shape.length; ++i) {
		y2 = y + i;		
		for (var j = 0; j < meuble.shape[i].length; ++j) {
			x2 = x + j;
			var td = meuble.caseToTdAt(j, i);
			if (typeof td.getElementsByClassName('caseMeuble')[0] !== 'undefined')
				room.tableau[y2][x2] = new CaseRoom(x, y, j, i, meuble);
		}
	}
	room.empty = false;
	refreshRoomView();
	addLog("Meuble ajouté");
}

/*
 * Fonction moveFurniture
 * Description: Déplace un meuble actuellement en coordonnées x0/y0 vers les coordonnées x/y.
 * 		L'affichage est rafraichie automatiquement.
 *
 * x0: coordonnées horizontal actuelle d'une des parties du meuble dans la salle.
 * y0: coordonnées vertical actuelle d'une des parties du meuble dans la salle.
 * x: coordonnées horizontal où placer le meuble dans la salle.
 * y: coordonnées vertical où placer le meuble dans la salle.
 */
function moveFurniture(x0, y0, x, y) {
	
}

/*
 * Fonction rotateFurniture
 * Description: Effectue une rotation du meuble dans le sens horaire (par défaut) dans la salle.
 *
 * meuble: un meuble de type 'Furniture'.
 * antiHoraire: (optionnelle) si vraie, le meuble sera tourné dans le sens anti-horaire.
 */
function rotateFurniture(meuble, antiHoraire) {
	
}

/*
 * Fonction removeFurniture
 * Description: Supprime un meuble à l'emplacement x/y dans la salle
 *
 * x: coordonnées horizontal où est placé le meuble dans la salle.
 * y: coordonnées vertical où est placé le meuble dans la salle.
 */
function removeFurniture(x, y) {
	
}

/*
 * Fonction addLog
 * Description: Ajout un message dans la vue des logs.
 *
 * msg: message à afficher dans les logs.
 */
function addLog(msg) {
	
}

/*
 * Fonction setRoomSize
 * Description: Modifie la taille de la salle (supprime tout meuble à l'interieur).
 * 		L'affichage est rafraichie automatiquement.
 *
 * metreCarre: taille en mètre carré de la salle (1m² => 1case)
 */
function setRoomSize(metreCarre)  {
	room = new Room(metreCarre);
	refreshRoomView();
	addLog("Salle réinitialisée");
	addLog("La taille de la salle a été modifiée");
}

/******************************************************************/
/************* FONCTIONS DE RAFRAICHISSEMENT DES VUES *************/
/******************************************************************/

/*
 * Fonction refreshFurnitureView
 * Description: affiche (ou réaffiche) la vue des accessoires et les accessoires qui y sont cotenu.
 */
function refreshFurnitureView() {
	var main = $$("#furnitureContainer .canvasDiv")[0];
		var table = new Element('table').inject(main);
			var tr;
			for (var i = 0; i < furnitures.length; ++i) {
				if (i%3 === 0)
					tr = new Element('tr').inject(table);
				var f = furnitures[i];
					var td = new Element('td').inject(tr);
						var div = new Element('div', {'id':f.name, 'class':'accessoire'}).inject(tr);
							div = new Element('div', {'class':'inner'}).inject(div);
								var name = new Element('div', {'class':'nameContainer'}).inject(div);
									new Element('div', {'class':'nameLabel', 'html':'Nom:'}).inject(name);
									new Element('div', {'class':'name', 'html':f.name}).inject(name);
								var shape = new Element('div', {'class':'shapeContainer'}).inject(div);
									f.shapeToHtml().inject(shape);
			}
}

/*
 * Fonction refreshRoomView
 * Description: affiche (ou réaffiche) la vue de la salle à aménager avec les meubles qui sont contenu dans celle-ci.
 */
function refreshRoomView() {
	var main = $$("#viewerContainer .canvasDiv")[0];
		main.innerHTML = "";
		var table = new Element('table').inject(main);
			for (var i = 0; i < room.taille; ++i) {
				var tr = new Element('tr').inject(table);
				for (var j = 0; j < room.taille; ++j) {
					var c = room.tableau[i][j];
					var td = new Element('td').inject(tr);
						if (typeof c.meuble !== 'undefined') {
							var div = new Element('div', {'id':c.meuble.name}).inject(td);
								c.meuble.caseToTdAt(c.x0, c.y0).inject(div);
						} else {
							new Element('div', {'class':'caseVide'}).inject(td);
						}
				}
			}
}