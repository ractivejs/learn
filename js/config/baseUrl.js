define( function () {

	'use strict';

	var path = window.location.pathname.split( '/' );
	path.splice( -3, 2 );

	return path.join( '/' );

});