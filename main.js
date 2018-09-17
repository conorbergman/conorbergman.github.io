var cards;

window.onload = function() {
	var cards = document.getElementsByClassName('card');

	for (var i=0; i<cards.length; i++) {
		var c = cards.item(i);
		c.style.cursor = 'pointer';

		c.onclick = function() {
			console.log(c.id);
		};
	}
}