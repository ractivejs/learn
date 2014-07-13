var ractive = new Ractive({
  el: output,
  template: template
});

ractive.on( 'activate', function ( event ) {
  alert( 'Activating!' );
});