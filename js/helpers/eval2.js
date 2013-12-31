define([

], function (

) {

	'use strict';

	// This changes the eval context to the global context. Bet you didn't know that!
	// Thanks, http://stackoverflow.com/questions/8694300/how-eval-in-javascript-changes-the-calling-context
	var eval2 = eval;
	return eval2;

});