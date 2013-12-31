define([

], function (

) {

	'use strict';

	var reportQueue = [];

	return function ( category, action, label, value ) {
		reportQueue[ reportQueue.length ] = {
			hitType: 'event',
			eventCategory: category,
			eventAction: action,
			eventLabel: label,
			eventValue: value
		};

		if ( ga ) {
			while ( reportQueue.length ) {
				ga( 'send', reportQueue.shift() );
			}
		}
	};

});