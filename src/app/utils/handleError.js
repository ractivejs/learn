export default function handleError ( err ) {
	setTimeout( () => {
		throw err;
	});
}
