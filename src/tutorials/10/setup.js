(function () {
	var promises = {};

	window.getJSON = function ( url ) {
		if ( !promises[ url ] ) {
			promises[ url ] = new Ractive.Promise( function ( fulfil ) {
				var xhr = new XMLHttpRequest();

				xhr.onload = function () {
					fulfil( JSON.parse( xhr.responseText ) );
				};

				xhr.open( 'GET', url );
				xhr.send();
			});
		}

		return promises[ url ];
	};
}());

window.scale = function ( val ) {
	// quick and dirty...
	return 2 * Math.abs( val );
};

window.format = function ( val ) {
  // Pro-tip: we're using `this.get()` inside this function -
  // as a result, Ractive knows that this computation depends
  // on the value of `degreeType` as well as `val`
  if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
    // convert celsius to fahrenheit
    val = ( val * 1.8 ) + 32;
  }

  return val.toFixed( 1 ) + '°';
};

window.getColor = function ( val ) {
  // quick and dirty function to pick a colour - the higher the
  // temperature, the warmer the colour
  var r = Math.max( 0, Math.min( 255, Math.floor( 2.56 * ( val + 50 ) ) ) );
  var g = 100;
  var b = Math.max( 0, Math.min( 255, Math.floor( 2.56 * ( 50 - val ) ) ) );

  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

window.monthNames = [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ];
