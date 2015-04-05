import roadtrip from 'roadtrip';
import AppView from './components/app';
import Nav from './components/Nav';
import getStep from 'getStep';

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

roadtrip
	.add( '/:title/:step', {
		enter ( route ) {
			return getStep( route.params.title, route.params.step ).then( step => {
				view.set( 'currentStep', step );
			});
		}
	})
	.start();

window.view = view;
