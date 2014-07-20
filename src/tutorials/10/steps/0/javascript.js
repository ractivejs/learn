getJSON( '/temperature.json' ).then( function ( cities ) {
  ractive.set( 'cities', cities );

  // when the user makes a selection from the drop-down, update the chart
  ractive.observe( 'selectedIndex', function ( index ) {
    // Change `this.set()` to `this.animate()`
    this.set( 'selectedCity', cities[ index ] );
  });
});

var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    scale: function ( val ) {
      // quick and dirty...
      return 2 * Math.abs( val );
    },
    format: function ( val ) {
      // Pro-tip: we're using `this.get()` inside this function -
      // as a result, Ractive knows that this computation depends
      // on the value of `degreeType` as well as `val`
      if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
        // convert celsius to fahrenheit
        val = ( val * 1.8 ) + 32;
      }

      return val.toFixed( 1 ) + '°';
    },
    getColor: function ( val ) {
      // quick and dirty function to pick a colour - the higher the
      // temperature, the warmer the colour
      var r = Math.max( 0, Math.min( 255, Math.floor( 2.56 * ( val + 50 ) ) ) );
      var g = 100;
      var b = Math.max( 0, Math.min( 255, Math.floor( 2.56 * ( 50 - val ) ) ) );

      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    monthNames: [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ]
  }
});
