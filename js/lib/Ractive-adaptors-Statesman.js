/*

	Ractive-adaptors-Statesman
	==========================

	Version 0.1.0.

	<< description goes here... >>

	==========================

	Troubleshooting: If you're using a module system in your app (AMD or
	something more nodey) then you may need to change the paths below,
	where it says `require( 'Ractive' )` or `define([ 'Ractive' ]...)`.

	==========================

	Usage: Include this file on your page below Ractive, e.g:

	    <script src='lib/Ractive.js'></script>
	    <script src='lib/Ractive-adaptors-Statesman.js'></script>

	Or, if you're using a module loader, require this module:

	    // requiring the plugin will 'activate' it - no need to use
	    // the return value
	    require( 'Ractive-adaptors-Statesman' );

	<< more specific instructions for this plugin go here... >>

*/

(function ( global, factory ) {

	'use strict';

	// Common JS (i.e. browserify) environment
	if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( require( 'Ractive', 'Statesman' ) );
	}

	// AMD?
	else if ( typeof define === 'function' && define.amd ) {
		define([ 'Ractive', 'Statesman' ], factory );
	}

	// browser global
	else if ( global.Ractive && global.Statesman ) {
		factory( global.Ractive, global.Statesman );
	}

	else {
		throw new Error( 'Could not find Ractive! It must be loaded before the Ractive-adaptors-Statesman plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive, Statesman ) {

	'use strict';

	var StatesmanWrapper;

	Ractive.adaptors.Statesman = {
		filter: function ( object ) {
			return object instanceof Statesman;
		},
		wrap: function ( ractive, model, keypath, prefix ) {
			return new StatesmanWrapper( ractive, model, keypath, prefix );
		}
	};

	StatesmanWrapper = function ( ractive, model, keypath, prefix ) {
		var wrapper = this;

		this.value = model;

		this.changeHandler = model.on( 'change', function ( changes ) {
			if ( !wrapper.settingModel ) {
				wrapper.settingView = true;
				ractive.set( prefix( changes ) );
				wrapper.settingView = false;
			}
		});
	};

	StatesmanWrapper.prototype = {
		teardown: function () {
			this.changeHandler.cancel();
		},
		get: function () {
			return this.value.get();
		},
		set: function ( keypath, value ) {
			if ( !this.settingView ) {
				this.settingModel = true;
				this.value.set( keypath, value );
				this.settingModel = false;
			}
		},
		reset: function ( object ) {
			// If the object is a Statesman instance, or it's not an object at all,
			// assume this one is being retired
			if ( object instanceof Statesman || typeof object !== 'object' ) {
				return false;
			}

			// Otherwise if this is a POJO, reset the model
			this.value.reset( object );
		}
	};

}));