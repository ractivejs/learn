/*global console */
define([
	'helpers/report',
	'helpers/eval2'
], function (
	report,
	eval2
) {

	'use strict';

	return function ( app ) {
		app.on( 'execute:javascript', function ( noReport ) {
			var template, code, output;

			template = window.template;
			output = window.output;

			code = app.get( 'javascript' );

			app.fire( 'teardown' );

			window.template = app.get( 'template' );
			window.output = document.getElementById( 'output' );

			try {
				eval2( code );

				if ( noReport !== true ) {
					report( 'javascript', 'execute', null, app.get( 'tutorialStepCode' ) );
				}

			} catch ( err ) {

				report( 'javascript', 'error', err.message || err, app.get( 'tutorialStepCode' ) );

				console.error( err );

				throw err; // TODO - feedback to user
			}

			// hygiene
			window.template = template;
			window.output = output;
		});
	};

});