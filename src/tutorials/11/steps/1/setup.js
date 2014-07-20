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
