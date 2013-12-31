define( function () {

	'use strict';

	return function ( str ) {
		if ( !str ) {
			return '';
		}
		return str.toLowerCase().replace( /[^a-z]/g, '-' ).replace( /-{2,}/g, '-' ).replace( /^-/, '' ).replace( /-$/, '' );
	};

});