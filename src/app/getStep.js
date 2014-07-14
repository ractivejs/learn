import Ractive from 'ractive';
import get from 'utils/get';

var promises, baseUrl, step;

promises = {};
baseUrl = window.location.origin;

// we already have some data...
step = window.TUTORIAL_DATA.step;
promises[ `${baseUrl}/${step.tutorialTitle}/${step.index+1}/index.json` ] = Ractive.Promise.resolve( step );

export default function fetch ( title, number ) {
	var url = `${baseUrl}/${title}/${number}/index.json`;

	if ( !promises[ url ] ) {
		promises[ url ] = get( url ).then( function ( json ) {
			return JSON.parse( json );
		});
	}

	return promises[ url ];
}
