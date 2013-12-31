var ractive = new Ractive({
  el: output,
  template: template
});

ractive.on( 'signIn', function () {
  var name = prompt( 'Enter your username to sign in', 'ractive_fan' );
  ractive.set( 'user.name', name );
});