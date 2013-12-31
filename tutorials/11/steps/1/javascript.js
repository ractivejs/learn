var linearScale, getPointsArray, resize, cities, ractive;

// this returns a function that scales a value from a given domain
// to a given range. Hat-tip to D3
linearScale = function ( domain, range ) {
  var d0 = domain[0], r0 = range[0], multipler = ( range[1] - r0 ) / ( domain[1] - d0 );

  return function ( num ) {
    return r0 + ( ( num - d0 ) * multipler );
  };
};

// this function takes an array of values, and returns an array of
// points plotted according to the given x scale and y scale
getPointsArray = function ( array, xScale, yScale, point ) {
  var result = array.map( function ( month, i ) {
    return xScale( i + 0.5 ) + ',' + yScale( month[ point ] );
  });

  // add the december value in front of january, and the january value after
  // december, to show the cyclicality
  result.unshift( xScale( -0.5 ) + ',' + yScale( array[ array.length - 1 ][ point ] ) );
  result.push( xScale( array.length + 0.5 ) + ',' + yScale( array[0][ point ] ) );

  return result;
};

ractive = new Ractive({
  el: output,
  template: template,
  data: {
    format: function ( val, degreeType ) {
      if ( degreeType === 'fahrenheit' ) {
        // convert celsius to fahrenheit
        val = ( val * 1.8 ) + 32;
      }

      return val.toFixed( 1 ) + '°';
    },
    getBand: function ( array, xScale, yScale ) {
      var high = [], low = [];

      high = getPointsArray( array, xScale, yScale, 'high' );
      low = getPointsArray( array, xScale, yScale, 'low' );

      return high.concat( low.reverse() ).join( ' ' );
    },
    monthNames: [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ]
  }
});


// because we're using SVG, we need to manually redraw
// when the container resizes
resize = function () {
  var width, height;

  width = ractive.nodes.svg_wrapper.clientWidth;
  height = ractive.nodes.svg_wrapper.clientHeight;

  ractive.set({
    width: width,
    height: height,
    xScale: linearScale([ 0, 12 ], [ 0, width ]),
    yScale: linearScale([ -10, 42 ], [ height - 20, 25 ])
  });
};

// For the purposes of this tutorial, we've got a global
// onResize function which lets us safely add resize handlers
// (they are removed each time this code re-executes)
onResize( resize );
resize();


// respond to user input
ractive.observe( 'selected', function ( index ) {
  this.animate( 'selectedCity', cities[ index ], {
    easing: 'easeOut',
    duration: 300
  });
});


// load our data
$.getJSON( '../../assets/temperature.json' ).then( function ( data ) {
  cities = data;

  ractive.set({
    cities: cities,
    selectedCity: cities[0] // initialise to London
  });
});