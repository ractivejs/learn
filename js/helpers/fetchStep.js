define([
	'config/baseUrl',
	'config/manifest',
	'helpers/getJSON'
], function (
	baseUrl,
	manifest,
	getJSON
) {

	'use strict';

	var stepCache = {}, step, id;

	// The first step was inlined on the page
	step = augmentStep( manifest.step, manifest.tutorialIndex, manifest.stepIndex );
	id = manifest.tutorialIndex + '/' + manifest.stepIndex;

	stepCache[ id ] = step;

	return function ( tutorialIndex, stepIndex, callback ) {
		var id, url;

		id = tutorialIndex + '/' + stepIndex;

		// if it's cached, groovy
		if ( stepCache[ id ] ) {
			callback( stepCache[ id ] );
			return;
		}

		// otherwise we need to fetch it
		url = baseUrl + 'data/' + tutorialIndex + '/' + stepIndex + '.json';
		getJSON( url, function ( stepData ) {
			stepCache[ id ] = augmentStep( stepData, tutorialIndex, stepIndex );
			callback( stepData );
		});
	};

	function augmentStep ( step, tutorialIndex, stepIndex ) {
		var tutorial;

		step.tutorial = tutorial = manifest.tutorials[ tutorialIndex ];

		step.index = stepIndex;
		step.tutorialIndex = tutorialIndex;
		step.slug = tutorial.slug + '/' + ( stepIndex + 1 ) + '/';

		return step;
	}

});