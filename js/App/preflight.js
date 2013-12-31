define([

], function (

) {

	'use strict';

	return function () {
		var eval2, payload, code, result;

		// test that eval2 will work (it won't in IE8)
		eval2 = eval;
		payload = 'eval() works correctly';

		(function () {
			code = 'var _evaltest = "' + payload + '"';
			eval2( code );
		}());

		(function () {
			try {
				result = eval2( '_evaltest' );
			} catch ( err ) {
				// we must be in IE
			}
		}());

		return result === payload;
	};

});