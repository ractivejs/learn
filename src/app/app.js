import AppView from './components/app';
import Nav from './components/Nav';
import getStep from 'getStep';
import handleError from 'utils/handleError';
import baseUrl from 'baseUrl';

var view, data;

new Nav({
	el: '.nav-container',
	tab: 'learn'
});

data = window.TUTORIAL_DATA;

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
			window.history.pushState( step, null, `${baseUrl}/${tutorialTitle}/${stepNumber}` );
		}).catch( handleError );
	}
});

// manage history
if ( window.history && typeof window.history.replaceState === 'function' ) {
	window.history.replaceState( data.step, '', window.location.pathname );
}

window.addEventListener( 'popstate', function ( event ) {
	if ( event.state ) {
		view.set( 'currentStep', event.state );
	}
});

window.view = view;
