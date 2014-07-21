var ractive = new Ractive({
  el: output,
  template: template,
  data: { visible: 1 }
});

ractive.on({
  show: function ( event, which ) {
    ractive.set( 'visible', null ).then( function () {
      ractive.set( 'visible', which );
    });
  }
});