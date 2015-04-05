import AppView from './components/app';
import Nav from './components/Nav';
import getStep from 'getStep';
import handleError from 'utils/handleError';
import baseUrl from 'baseUrl';

new Nav({
	el: '.nav-container',
	tab: 'learn'
});

const data = window.TUTORIAL_DATA;

const view = new AppView({
	el: '.app-container',
	data: {
		manifest: data.manifest,
		currentStep: data.step
	}
});

// TODO use proper router?
view.on({
	navigate ( tutorialTitle, stepNumber ) {
		var tutorialIndex, stepIndex;

		getStep( tutorialTitle, stepNumber ).then( step => {
			view.set( 'currentStep', step );
			window.history.pushState( step, null, `${baseUrl}/${tutorialTitle}/${stepNumber}` );
		}).catch( handleError );
	}
});

// manage history
if ( window.history && typeof window.history.replaceState === 'function' ) {
	window.history.replaceState( data.step, '', window.location.pathname );
}

window.addEventListener( 'popstate', event => {
	if ( event.state ) {
		view.set( 'currentStep', event.state );
	}
});

window.view = view;
