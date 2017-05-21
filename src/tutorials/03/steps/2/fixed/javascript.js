var ractive = new Ractive({
  el: output,
  template: template
});

var listener = ractive.on({
  activate: function () {
    alert( 'Activating!' );
  },
  deactivate: function () {
    alert( 'Deactivating!' );
  },
  silence: function () {
  	alert( 'No more alerts!' );
  	listener.cancel();
  }
});
