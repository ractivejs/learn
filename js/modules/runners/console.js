define([
	'helpers/report',
	'helpers/eval2'
], function (
	report,
	eval2
) {

	'use strict';

	return function ( app ) {
		app.on( 'execute:console', function () {
			var code = app.get( 'console' );

			try {
				eval2( code );

				report( 'console', 'execute', null, app.get( 'tutorialStepCode' ) );

			} catch ( err ) {

				report( 'console', 'error', err.message || err, app.get( 'tutorialStepCode' ) );

				throw err; // TODO - feedback to user
			}
		});
	};

});