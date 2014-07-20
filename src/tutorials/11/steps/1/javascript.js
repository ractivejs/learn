getJSON( '/temperature.json' ).then( function ( cities ) {
  ractive.set( 'cities', cities );

  ractive.observe( 'selectedIndex', function ( index ) {
    this.animate( 'selectedCity', cities[ index ], {
      easing: 'easeOut',
      duration: 300
    });
  });
});

var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    format: function ( val ) {
      if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
        // convert celsius to fahrenheit
        val = ( val * 1.8 ) + 32;
      }

      return val.toFixed( 1 ) + '°';
    },
    monthNames: [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ]
  },

  computed: {
    // The SVG path is a computed value that updates whenever
    // its dependencies (declared with `this.get()`) change
    svgPath: function () {
      var data = this.get( 'selectedCity.months' ),
          xScale = this.get( 'xScale' ),
          yScale = this.get( 'yScale' );

          // Get an array of points representing the edges of
          // the temperature band...
          high = getPoints( 'high' ),
          low = getPoints( 'low' );

      // ...and join them together
      return high.concat( low.reverse() ).join( ' ' );

      function getPoints ( highOrLow ) {
        var result = data.map( function ( month, i ) {
          return xScale( i + 0.5 ) + ',' + yScale( month[ highOrLow ] );
        });

        // Add the December value in front of January, and the January value after
        // December, to show the cyclicality
        result.unshift( xScale( -0.5 ) + ',' + yScale( data[ data.length - 1 ][ highOrLow ] ) );
        result.push( xScale( data.length + 0.5 ) + ',' + yScale( data[0][ highOrLow ] ) );

        return result;
      }
    },

    // When the dimensions of the container change, we need
    // to recreate the linear scaling functions
    xScale: function () {
      return linearScale([ 0, 12 ], [ 0, this.get( 'width' ) ]);
    },
    yScale: function () {
      return linearScale([ -10, 42 ], [ this.get( 'height' ) - 20, 25 ]);
    }
  }
});

// this returns a function that scales a value from a
// given domain to a given range. Hat-tip to D3
function linearScale ( domain, range ) {
  var d0 = domain[0], r0 = range[0], multiplier = ( range[1] - r0 ) / ( domain[1] - d0 );

  return function ( num ) {
    return r0 + ( ( num - d0 ) * multiplier );
  };
}

// Because we're using SVG, we need to recalculate
// scales when the container resizes
function resize () {
  var wrapper = ractive.find( '.svg-wrapper' );

  ractive.set({
    width: wrapper.clientWidth,
    height: wrapper.clientHeight
  });
};

// For the purposes of this tutorial, we've got a global
// onResize function which lets us safely add resize handlers
onResize( resize );
setTimeout( resize );
