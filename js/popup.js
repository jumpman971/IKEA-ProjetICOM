function Popup(title, content, closingEvent) {
	var p = document.createElement('div');
	p.id = 'popup';
	var t = document.createElement('div');
	t.id = 'title';
	t.innerHTML = title;
	var c = document.createElement('div');
	c.id = 'content';
	var exit = document.createElement('img');
	exit.id = 'exitCross';
	exit.src = 'images/window/exit-cross.png';
	if (typeof closingEvent === 'undefined') {
		exit.addEventListener('click', function(e) {
			$('popup').remove();
		});
	} else
		exit.addEventListener('click', closingEvent);
	
	t.appendChild(exit);
	c.appendChild(content);
	p.appendChild(t);
	p.appendChild(c);
	document.body.appendChild(p);
	
	return p;
}

function PopupMsg(title, msg) {
	var content = new Element('div');
		new Element('div', {'id':'msgPopup', 'html':msg}).inject(content);
		var bp = new Element('input', {'type':'button','value':'Ok'}).inject(content).addEventListener('click', function(e) {
			$('popup').remove();
		});
	return new Popup(title, content);
}