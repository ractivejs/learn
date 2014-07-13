var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    signedIn: false
  }
});

ractive.on( 'signIn', function () {
  var name = prompt( 'Enter your username to sign in', 'ractive_fan' );

  ractive.set({
    username: name,
    signedIn: true
  });
});