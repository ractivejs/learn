var ractive = new Ractive({
  el: output,
  template: template
});

ractive.on({
  activate: function () {
    alert( 'Activating!' );
  },
  deactivate: function () {
    alert( 'Deactivating!' );
  }
});