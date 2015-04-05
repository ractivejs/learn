import Ractive from 'ractive';
import getUrl from 'utils/get';
import slugify from 'utils/slugify';
import Promise from 'utils/Promise';
import baseUrl from 'baseUrl';

var promises, data, step, indexByTitle = {}, queue = [];

promises = {};

// we already have some data...
data = window.TUTORIAL_DATA;
step = data.step;
promises[ `${baseUrl}/${step.tutorialTitle}/${step.index+1}/index.json` ] = Promise.resolve( step );

// So we can identify next/previous steps...
data.manifest.forEach( ( x, i ) => {
	var title = slugify( x.title );
	indexByTitle[ title ] = i;
	queue.push( title );
});

// Pre-fetch the first step of each tutorial
fetchNext();

export default fetch;

function fetchNext () {
	var title;

	if ( title = queue.shift() ) {
		fetch( title, 1 ).then( fetchNext );
	}
}

function fetch ( title, number ) {
	var url, promise, tutorialIndex, tutorialData;

	url = `${baseUrl}/${title}/${number}/index.json`;

	if ( !promises[ url ] ) {
		promise = promises[ url ] = getUrl( url ).then( function ( json ) {
			return JSON.parse( json );
		});

		// Pre-fetch next step
		tutorialIndex = indexByTitle[ title ];
		tutorialData = data.manifest[ tutorialIndex ];

		if ( number < tutorialData.numSteps - 1 ) {
			promise.then( () => fetch( title, number + 1 ) );
		}
	}

	return promises[ url ];
}
