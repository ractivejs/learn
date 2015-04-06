export default function slugify ( string ) {
	if ( !string ) {
		return '';
	}

	return string
		.toLowerCase()
		.replace( /[^a-z]/g, '-' )
		.replace( /-{2,}/g, '-' )
		.replace( /^-/, '' )
		.replace( /-$/, '' );
}
