var ractive = new Ractive({
  el: output,
  template: template,
  data: { visible: 1 }
});

ractive.on({
  show: function ( event, which ) {
    this.set( 'visible', which );
  }
});