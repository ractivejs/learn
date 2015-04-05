import Promise from 'utils/Promise';

export default function get ( url ) {
	return new Promise( ( fulfil, reject ) => {
		var xhr = new XMLHttpRequest();

		xhr.onload = () => fulfil( xhr.responseText );
		xhr.onerror = reject;

		xhr.open( 'GET', url );
		xhr.send();
	});
}
