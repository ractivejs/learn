define([
	'config/baseUrl',
	'Statesman',
	'helpers/fetchStep',

	'App/preflight',
	'App/launch'
], function (
	baseUrl,
	Statesman,
	fetchStep,

	preflight,
	launch
) {

	'use strict';

	var App = Statesman.extend({
		debug: true,

		preflight: preflight,
		launch: launch,


		baseUrl: baseUrl,

		computed: {
			currentTutorial: '${tutorials}[ ${tutorialIndex } ]',
			prevTutorial: '${tutorials}[ ${tutorialIndex} - 1 ]',
			nextTutorial: '${tutorials}[ ${tutorialIndex} + 1 ]',
			// currentStep: '${currentTutorial}.steps[ ${stepIndex} ]',

			currentStep: {
				async: true,
				dependsOn: [ 'tutorialIndex', 'stepIndex' ],
				get: function ( tutorialIndex, stepIndex ) {
					var done = this.async();
					fetchStep( tutorialIndex, stepIndex, done );
				}
			},

			prevStep: {
				async: true,
				dependsOn: [ 'tutorials', 'tutorialIndex', 'stepIndex' ],
				get: function ( tutorials, tutorialIndex, stepIndex ) {
					var done = this.async();
					if ( stepIndex > 0 ) {
						fetchStep( tutorialIndex, stepIndex - 1, done );
					} else if ( tutorialIndex > 0 ) {
						fetchStep( tutorialIndex - 1, tutorials[ tutorialIndex - 1 ].length - 1, done );
					} else {
						done( null );
					}
				}
			},

			nextStep: {
				async: true,
				dependsOn: [ 'tutorials', 'tutorialIndex', 'stepIndex' ],
				get: function ( tutorials, tutorialIndex, stepIndex ) {
					var done = this.async(), currentTutorial = tutorials[ tutorialIndex ];
					if ( stepIndex < currentTutorial.length - 1 ) {
						fetchStep( tutorialIndex, stepIndex + 1, done );
					} else if ( tutorialIndex < tutorials.length - 1 ) {
						fetchStep( tutorialIndex + 1, 0, done );
					} else {
						done( null );
					}
				}
			},

			prevTutorialFirstStep: {
				async: true,
				dependsOn: [ 'tutorialIndex' ],
				get: function ( tutorialIndex ) {
					var done = this.async();
					if ( tutorialIndex > 0 ) {
						fetchStep( tutorialIndex - 1, 0, done );
					} else {
						done( null );
					}
				}
			},

			nextTutorialFirstStep: {
				async: true,
				dependsOn: [ 'tutorials', 'tutorialIndex' ],
				get: function ( tutorials, tutorialIndex ) {
					var done = this.async();
					if ( tutorialIndex < tutorials.length - 1 ) {
						fetchStep( tutorialIndex + 1, 0, done );
					} else {
						done( null );
					}
				}
			},

			stepOrTutorial: '${currentStep.tutorial} === ${nextStep.tutorial} ? "step" : "tutorial"',
			tutorialStepCode: '( ( ${tutorialIndex} + 1 ) * 100 ) + ${stepIndex} + 1'
		}
	});

	return App;

});