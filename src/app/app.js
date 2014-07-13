import AppView from 'ractive_components/app';
import getStep from 'getStep';

var view, data, tutorialIndexByTitle;

data = window.TUTORIAL_DATA;

tutorialIndexByTitle = {};
data.manifest.forEach( ( tutorial, i ) => tutorialIndexByTitle[ tutorial.title ] = i );

view = new AppView({
	el: '.app-container',
	data: {
		manifest: data.manifest,
		currentStep: data.step
	}
});

view.on({
	navigate: function ( tutorialTitle, stepNumber ) {
		var tutorialIndex, stepIndex;

		getStep( tutorialTitle, stepNumber ).then( function ( step ) {
			view.set( 'currentStep', step );
			window.history.pushState( step, null, '/' + tutorialTitle + '/' + stepNumber );
		});
	}
});

// manage history
if ( window.history && typeof window.history.replaceState === 'function' ) {
	window.history.replaceState( data.step, '', window.location.pathname );
}

window.addEventListener( 'popstate', function ( event ) {
	view.set( 'currentStep', event.state );
});
