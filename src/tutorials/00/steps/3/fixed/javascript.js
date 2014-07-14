var ractive = new Ractive({
  el: output,
  template: template,
  data: {
  	greeting: 'Hello',
  	name: 'world',
  	color: 'purple',
  	size: 2,
  	font: 'Arial'
  }
});
