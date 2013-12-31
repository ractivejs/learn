/*global define, window, document */

define([
	'domReady',
	'App/_App',
	'modules/main',
	'config/manifest',

	'lib/Ractive-events-tap',
	'lib/Ractive-events-keys',
	'lib/Ractive-transitions-fade',
	'lib/Ractive-transitions-fly',
	'lib/Ractive-transitions-slide'
], function (
	domReady,
	App,
	main,
	manifest
) {

	'use strict';

	var app = new App( manifest );

	domReady( function () {
		var el, warning;

		el = document.getElementById( 'container' );

		if ( !app.preflight() ) {
			warning = document.createElement( 'div' );
			warning.innerHTML = '<p>This app will not work in some older browsers that implement <code>eval</code> incorrectly, including this one. Please try again using Chrome or Firefox.</p><p>Note that <span class="logo">Ractive.js</span> itself works in all modern browsers and Internet Explorer 8 and above.</p>';
			el.appendChild( warning );
		}

		else {
			app.launch( el );
			main( app );
		}
	});

	window.app = app; // useful for debugging!

	return app;

});