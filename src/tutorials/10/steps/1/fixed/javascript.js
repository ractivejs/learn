getJSON( '/temperature.json' ).then( function ( cities ) {
  ractive.set( 'cities', cities );

  // when the user makes a selection from the drop-down, update the chart
  ractive.observe( 'selectedIndex', function ( index ) {
    this.animate( 'selectedCity', cities[ index ], {
      easing: 'easeOut'
    });
  });
});

var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    // For readability, these have been pre-defined.
    // Refer to step 1 to see their implementations
    scale: scale,
    format: format,
    getColor: getColor,
    monthNames: monthNames
  }
});
