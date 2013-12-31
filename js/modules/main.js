define([
	'config/baseUrl',
	'View/_View',
	'helpers/report',
	'helpers/slugify',
	'config/manifest',
	'modules/editors/_editors',
	'modules/runners/javascript',
	'modules/runners/console',
	'modules/globals'
], function (
	baseUrl,
	View,
	report,
	slugify,
	manifest,
	editors,
	javascriptRunner,
	consoleRunner,
	globals
) {

	'use strict';

	return function ( app ) {
		var mainView;


		mainView = new View({
			el: 'container',
			data: app
		});

		app.view = mainView;

		// initialise submodules
		editors( app );
		javascriptRunner( app );
		consoleRunner( app );
		globals( app );


		app.on({
			reset: function ( step, noReport ) {
				if ( !step ) {
					return;
				}

				// teardown any Ractive instances that have been created
				app.fire( 'teardown' );

				app.set({
					template: step.template,
					javascript: step.javascript,
					console: step.console
				});

				mainView.reset();

				if ( !noReport ) {
					report( 'tutorial', 'reset', null, app.get( 'tutorialStepCode' ) );
				}

				// Set document title
				document.title = step.tutorial.title + ' (' + ( step.index + 1 ) + '/' + step.tutorial.length + ') | Learn Ractive.js';

				// Wait a beat before executing js, because Ractive doesn't render
				// until after this, and we need to make sure all the CSS is in place
				if ( step.init ) {
					setTimeout( function () {
						app.fire( 'execute:javascript', true );
					}, 0 );
				}
			}
		});

		mainView.on({
			resize: function () {
				app.fire( 'resize' );
			},
			'execute-js': function () {
				app.fire( 'execute:javascript' );
			},
			'execute-console': function () {
				app.fire( 'execute:console' );
			},
			goto: function ( event, step ) {
				var state, title, url;

				if ( !step ) {
					event.original.preventDefault();
					return;
				}

				if ( window.history && !event.original.metaKey ) {
					event.original.preventDefault();

					state = {
						tutorialIndex: step.tutorialIndex,
						stepIndex: step.index
					};

					title = step.tutorial.title + ' | Learn Ractive.js';
					url = baseUrl + step.slug;

					window.history.pushState( state, title, url );
					app.set( state );
				}
			},
			fix: function () {
				var fixed, currentStep;

				currentStep = app.get( 'currentStep' );
				fixed = currentStep.fixed;

				if ( !fixed ) {
					return;
				}

				app.set({
					template: fixed.template || currentStep.template,
					javascript: fixed.javascript || currentStep.javascript,
					console: fixed.console || currentStep.console
				});

				report( 'javascript', 'fix', null, app.get( 'tutorialStepCode' ) );

				app.fire( 'execute:javascript', true );
			},
			reset: function () {
				app.fire( 'reset', app.get( 'currentStep' ) );
			}
		});

		app.observe({
			currentStep: function ( step ) {
				app.fire( 'reset', step, true );
			}
		});

		// manage backward/forward
		window.addEventListener( 'popstate', function ( event ) {
			app.set( event.state );
		});

		app.fire( 'reset' );
	};

});