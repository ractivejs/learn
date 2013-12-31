/*

	Ractive-events-keys
	===================

	Version 0.1.0.

	<< description goes here... >>

	==========================

	Troubleshooting: If you're using a module system in your app (AMD or
	something more nodey) then you may need to change the paths below,
	where it says `require( 'Ractive' )` or `define([ 'Ractive' ]...)`.

	==========================

	Usage: Include this file on your page below Ractive, e.g:

	    <script src='lib/Ractive.js'></script>
	    <script src='lib/Ractive-events-keys.js'></script>

	Or, if you're using a module loader, require this module:

	    // requiring the plugin will 'activate' it - no need to use
	    // the return value
	    require( 'Ractive-events-keys' );

	<< more specific instructions for this plugin go here... >>

*/

(function ( global, factory ) {

	'use strict';

	// Common JS (i.e. browserify) environment
	if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( require( 'Ractive' ) );
	}

	// AMD?
	else if ( typeof define === 'function' && define.amd ) {
		define([ 'Ractive' ], factory );
	}

	// browser global
	else if ( global.Ractive ) {
		factory( global.Ractive );
	}

	else {
		throw new Error( 'Could not find Ractive! It must be loaded before the Ractive-events-keys plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive ) {

	'use strict';

	// TODO can we just declare the keydowhHandler once? using `this`?

	var events, makeKeyDefinition = function ( code ) {
		return function ( node, fire ) {
			var keydownHandler;

			node.addEventListener( 'keydown', keydownHandler = function ( event ) {
				var which = event.which || event.keyCode;

				if ( which === code ) {
					event.preventDefault();

					fire({
						node: node,
						original: event
					});
				}
			}, false );

			return {
				teardown: function () {
					node.removeEventListener( 'keydown', keydownHandler, false );
				}
			};
		};
	};

	events = Ractive.events;

	events.enter = makeKeyDefinition( 13 );
	events.tab = makeKeyDefinition( 9 );
	events.escape = makeKeyDefinition( 27 );
	events.space = makeKeyDefinition( 32 );

	events.leftarrow = makeKeyDefinition( 37 );
	events.rightarrow = makeKeyDefinition( 39 );
	events.downarrow = makeKeyDefinition( 40 );
	events.uparrow = makeKeyDefinition( 38 );

}));