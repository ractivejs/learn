define([
	'Ractive'
], function (
	RealRactive
) {

	'use strict';

	var timeouts, teardownQueue, resizeHandlers;

	timeouts = [];
	teardownQueue = [];
	resizeHandlers = [];

	return function ( app ) {
		var prop, _setTimeout, _clearTimeout;

		// Ractive
		window.Ractive = function () {
			// we need to override the constructor so we can keep track of
			// which views need to be torn down during the tutorial
			RealRactive.apply( this, arguments );
			teardownQueue[ teardownQueue.length ] = this;
		};

		// copy static methods and properties from the real Ractive to the fake one
		for ( prop in RealRactive ) {
			if ( RealRactive.hasOwnProperty( prop ) ) {
				window.Ractive[ prop ] = RealRactive[ prop ];
			}
		}

		// Ditto for the non-enumerable ones
		[ 'prototype', 'partials', 'adaptors', 'components', 'decorators', 'events', 'transitions', 'svg', 'VERSION' ].forEach( function ( prop ) {
			var descriptor = Object.getOwnPropertyDescriptor( RealRactive, prop );
			Object.defineProperty( window.Ractive, prop, descriptor );
		});

		// setTimeout and clearTimeout
		_setTimeout = window.setTimeout;
		_clearTimeout = window.clearTimeout;

		window.setTimeout = function () {
			var timeout = _setTimeout.apply( window, arguments );
			timeouts[ timeouts.length ] = timeout;
		};

		window.clearTimeout = function ( timeout ) {
			var index = timeouts.indexOf( timeout );
			if ( index !== -1 ) {
				timeouts.splice( index, 1 );
			}

			_clearTimeout( timeout );
		};


		// resize handlers
		window.onResize = function ( handler ) {
			resizeHandlers[ resizeHandlers.length ] = handler;
		};


		app.on({
			resize: function () {
				var i = resizeHandlers.length;
				while ( i-- ) {
					resizeHandlers[i].call();
				}
			},

			teardown: function () {
				while ( teardownQueue.length ) {
					teardownQueue.pop().teardown();
				}

				// neuter any onResize handlers
				resizeHandlers = [];

				// clear any timeouts
				while ( timeouts[0] ) {
					window.clearTimeout( timeouts[0] );
				}
			}
		});
	};

});