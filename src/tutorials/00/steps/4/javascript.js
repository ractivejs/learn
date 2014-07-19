var ractive = new Ractive({
  el: output,
  template: template,
  data: {
  	greeting: 'Hello',
  	name: 'world',
  	color: 'purple',
  	size: 4,
  	font: 'Georgia'
  } // add a 'counter' property...
});

// add event handler here
