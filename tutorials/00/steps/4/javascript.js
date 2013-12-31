var ractive = new Ractive({
  el: output,
  template: template,
  data: {
  	greeting: 'Hello',
  	recipient: 'world',
  	color: 'purple',
  	size: 2,
  	font: 'Arial'
  } // add a 'counter' property...
});

// add event handler here