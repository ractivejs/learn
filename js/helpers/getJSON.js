define( function () {

	'use strict';

	return function ( url, callback, errorHandler ) {
		var xhr, data;

		xhr = new XMLHttpRequest();
		xhr.open( 'GET', url );

		xhr.onload = function () {
			try {
				data = JSON.parse( xhr.responseText );
				callback( data );
			} catch ( err ) {
				if ( errorHandler ) {
					errorHandler( 'Malformed JSON (' + url + ')' );
				} else {
					throw err;
				}
			}
		};

		xhr.onerror = function ( err ) {
			if ( errorHandler ) {
				errorHandler( err.message || err );
			} else {
				throw err;
			}
		};

		xhr.send();
	};

});