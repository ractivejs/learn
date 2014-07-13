import get from 'utils/get';

var promises, baseUrl;

promises = {};
baseUrl = window.location.origin;

export default function fetch ( title, number ) {
	var url = `${baseUrl}/${title}/${number}/index.json`;

	if ( !promises[ url ] ) {
		promises[ url ] = get( url ).then( function ( json ) {
			return JSON.parse( json );
		});
	}

	return promises[ url ];
}
