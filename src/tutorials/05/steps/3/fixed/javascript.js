var ractive = new Ractive({
  el: output,
  template: template,
  data: { superheroes: xmen }
});

ractive.on( 'sort', function ( event, column ) {
  alert( 'Sorting by ' + column );
});
