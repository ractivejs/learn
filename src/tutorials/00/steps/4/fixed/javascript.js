var ractive = new Ractive({
  el: output,
  template: template,
  data: {
  	greeting: 'Hello',
  	name: 'world',
  	color: 'purple',
  	size: 4,
  	font: 'Georgia',
  	counter: 0
  }
});

document.getElementById( 'count' ).addEventListener( 'click', function () {
  ractive.set( 'counter', ractive.get( 'counter' ) + 1 );
});
