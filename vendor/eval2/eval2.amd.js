/*

	eval2.js - 0.1.5 - 2014-06-02
	==============================================================

	Copyright 2014 Rich Harris
	Released under the MIT license.

*/

define( function() {

	'use strict';


	var _eval, isBrowser, isNode, head, Module;

	// This causes code to be eval'd in the global scope
	_eval = eval;

	if ( typeof document !== 'undefined' ) {
		isBrowser = true;
		head = document.getElementsByTagName( 'head' )[ 0 ];
	} else if ( typeof process !== 'undefined' ) {
		isNode = true;
		Module = ( require.nodeRequire || require )( 'module' );
	}

	function eval2( script, options ) {
		options = ( typeof options === 'function' ? {
			callback: options
		} : options || {} );

		if ( options.sourceURL ) {
			script += '\n//# sourceURL=' + options.sourceURL;
		}

		try {
			return _eval( script );
		} catch ( err ) {
			if ( isNode ) {
				locateErrorUsingModule( script, options.sourceURL || '' );
				return;
			}

			// In browsers, only locate syntax errors. Other errors can
			// be located via the console in the normal fashion
			else if ( isBrowser && err.name === 'SyntaxError' ) {
				locateErrorUsingDataUri( script );
			}

			throw err;
		}
	}

	eval2.Function = function() {
		var i, args = [],
			body, wrapped;

		i = arguments.length;
		while ( i-- ) {
			args[ i ] = arguments[ i ];
		}

		body = args.pop();
		wrapped = '(function (' + args.join( ', ' ) + ') {\n' + body + '\n})';

		return eval2( wrapped );
	};

	function locateErrorUsingDataUri( code ) {
		var dataURI, scriptElement;

		dataURI = 'data:text/javascript;charset=utf-8,' + encodeURIComponent( code );

		scriptElement = document.createElement( 'script' );
		scriptElement.src = dataURI;

		scriptElement.onload = function() {
			head.removeChild( scriptElement );
		};

		head.appendChild( scriptElement );
	}

	function locateErrorUsingModule( code, url ) {
		var m = new Module();

		try {
			m._compile( 'module.exports = function () {\n' + code + '\n};', url );
		} catch ( err ) {
			console.error( err );
			return;
		}

		m.exports();
	}

	return eval2;

} );
