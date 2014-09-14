export default function handleError ( err ) {
	setTimeout( function () {
		throw err;
	});
}
