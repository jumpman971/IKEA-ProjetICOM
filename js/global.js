var room;
var furnitures = [];
//un meuble = cases [{coordonn�es, meuble(pere)},...]

/*****************************************/
/************* CONSTRUCTEURS *************/
/*****************************************/

/*
 * Constructeur Room
 * Description: Instancie un objet de type 'room', qui correspond � la salle � am�nager.
 * 
 * metreCarre: taille en m�tre carr� de la salle (1m� => 1case)
 */
function Room(metreCarre) {
	var tab = [[]];
	for (var i = 0; i < metreCarre; ++i) {
		for (var j = 0; j < metreCarre; ++j)
			tab[i][j] = {};
	}
	
	return {taille: metreCarre, empty: true, tableau: tab};
}

/*
 * Constructeur Furniture
 * Description: Instancie un objet de type 'furniture', qui correspond � un meuble.
 * 
 * nom: nom du meuble
 * forme: forme du meuble qui est un tableau 2D bool�en (ou d'entier) o� une case vide est 0, sinon 1
 */
function Furniture(nom, forme) {
	var f = {name: nom, shape: forme, 'shapeToHtml': shapeToHtml};
	
	function shapeToHtml() {
		var table = new Element('table');
		for (var i = 0; i < f.shape.length; ++i) {
			var tr = new Element('tr').inject(table);
			for (var j = 0; j < f.shape[i].length; ++j) {
				var td = new Element('td').inject(tr);
				var src = "images/meuble/";
				//si cot� nord/ouest
				if (i===0 && j === 0)
					src += "case-nord_ouest";
				//si cot� nord/est
				else if (i===0 && j === f.shape[i].length-1)
					src += "case-nord_est";
				//si cot� sud/ouest
				else if (i===f.shape.length-1 && j === 0)
					src += "case-sud_ouest";
				//si cot� sud/est
				else if (i===f.shape.length-1 && j === f.shape[i].length-1)
					src += "case-sud_est";
				//si cot� nord
				else if (i===0 && (j !== f.shape[i].length-1 && j !== 0))
					src += "case-nord";
				//si cot� ouest
				else if ((i !== f.shape.length-1 && i !== 0) && j===0)
					src += "case-ouest";
				//si cot� est
				else if ((i !== f.shape.length-1 && i !== 0) && j===f.shape[i].length-1)
					src += "case-est";
				//si cot� sud
				else if (i===f.shape.length-1 && (j !== f.shape[i].length-1 && j !== 0))
					src += "case-sud";
				//sinon pi�ce milieu (ou pas)
				else
					src = "";
				
				if (f.shape[i].charAt(j)==="1")
					new Element('img', {'class':'caseMeuble', 'src':src+".png"}).inject(td);
				else
					new Element('img', {'class':'caseMeuble vide', 'src':src+".png"}).inject(td);
			}
		}
		return table;
	}
	
	return f;
}

/*************************************/
/************* EVENEMENT *************/
/*************************************/
document.addEventListener('DOMContentLoaded', function() {
	$$('#cmdContainer input')[0].addEventListener('keydown', function onInputCmdKeyPress(e) {
		if (e.keyCode == 13) //on appui sur la touche entrer
			sendCmd(e.target.value);
	});
});

/*********************************************/
/************* FONCTIONS GENERAL *************/
/*********************************************/

/*
 * Fonction sendCmd
 * Description: Envoie une commande de type 'texte' (string) au compilateur pour qu'elle soit interpr�t�e.
 *
 * cmd: la commande de type 'texte' (string)
 */
function sendCmd(cmd) {
	//alert("cmd envoy�"); //� supprimer
	//var text = $("#textarea").val();
	var filename = "to_compile.com";
	var blob = new Blob([cmd], {type: "text/plain;charset=utf-8"});
	//saveAs(blob, filename+".com");
	var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cmd));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
	$$('#cmdContainer input')[0].value = "";
}

/*
 * Fonction loadFurniture
 * Description: Instancie et ajoute un objet de type 'furniture' dans les accessoires.
 * 		L'affichage est rafraichie automatiquement.
 *
 * nom: nom du meuble
 * forme: forme du meuble qui est un tableau 2D bool�en (ou d'entier) o� une case vide est 0, sinon 1
 */
function loadFurniture(nom, forme) {
	furnitures.push(new Furniture(nom, forme));
	refreshFurnitureView();
}

/*
 * Fonction addFurnitureToRoom
 * Description: Ajoute un meuble de type 'furniture' dans la salle aux coordonn�es x y.
 * 		L'affichage est rafraichie automatiquement.
 *
 * meuble: objet de type 'furniture' repr�sentant un meuble.
 * x: coordonn�es horizontal dans la salle.
 * y: coordonn�es vertical dans la salle.
 */
function addFurnitureToRoom(meuble, x, y) {
	//cases [{coordonn�es, meuble(pere)},...]
	room.tableau[y][x] = {'x':x, 'y': y, 'meuble': meuble};
	room.empty = false;
	refreshRoomView();
}

/*
 * Fonction setRoomSize
 * Description: Modifie la taille de la salle (supprime tout meuble � l'interieur).
 * 		L'affichage est rafraichie automatiquement.
 *
 * metreCarre: taille en m�tre carr� de la salle (1m� => 1case)
 */
function setRoomSize(metreCarre)  {
	room = new Room(metreCarre);
	refreshRoomView();
}

/******************************************************************/
/************* FONCTIONS DE RAFRAICHISSEMENT DES VUES *************/
/******************************************************************/

/*
 * Fonction refreshFurnitureView
 * Description: affiche (ou r�affiche) la vue des accessoires et les accessoires qui y sont cotenu.
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
 * Description: affiche (ou r�affiche) la vue de la salle � am�nager avec les meubles qui sont contenu dans celle-ci.
 */
function refreshRoomView() {
	var main = $$("#viewerContainer .canvasDiv")[0];
		var table = new Element('table').inject(main);
			for (var i = 0; i < room.taille; ++i) {
				var tr = new Element('tr').inject(table);
				var f = furnitures[i];
				for (var j = 0; j < room.taille; ++j) {
					var c = room.tableau[i][j];
					var td = new Element('td').inject(tr);
						var div = new Element('div', {'id':c, 'class':'accessoire'}).inject(tr);
							div = new Element('div', {'class':'inner'}).inject(div);
								var name = new Element('div', {'class':'nameContainer'}).inject(div);
									new Element('div', {'class':'nameLabel', 'html':'Nom:'}).inject(name);
									new Element('div', {'class':'name', 'html':f.name}).inject(name);
								var shape = new Element('div', {'class':'shapeContainer'}).inject(div);
									f.shapeToHtml().inject(shape);
				}
			}
}