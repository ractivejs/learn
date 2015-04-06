var promo = require( 'promo' ),
	Promise = promo.Promise,
	fs = require( 'fs' ),
	path = require( 'path' ),
	_ = require( 'lodash' ),
	mkdirp = promo( require( 'mkdirp' ) ),
	spelunk = promo( require( 'spelunk' ) ),

	readFile = promo( fs.readFile ),
	writeFile = promo( fs.writeFile ),

	config;

config = {
	gaTrackingId: 'UA-5602942-2',
	gaProperty: 'learn.ractivejs.org',
	id: 'learn'
};

module.exports = function compileTutorials ( inputdir, outputdir, options ) {
	return spelunk( path.join( inputdir, 'tutorials' ) ).then( function ( tutorialData ) {
		return Promise.all([
			tutorialPromise( inputdir, outputdir, tutorialData ),
			redirectPromise( inputdir, outputdir, tutorialData )
		]);
	});
};

function tutorialPromise ( inputdir, outputdir, tutorialData, Tutorial ) {
	var Tutorial = require( path.join( inputdir, 'components/Tutorial' ) );

	var promises;

	promises = tutorialData.map( function ( tutorial, tutorialIndex ) {
		var promises = tutorial.steps.map( function ( step, stepIndex ) {
			var dirname, htmlFilename, jsonFilename, content;

			step = _.extend( {}, step, {
				index: stepIndex,
				numSiblings: tutorial.steps.length,
				tutorialTitle: tutorial.title,
				tutorialIndex: tutorialIndex
			});

			if ( tutorial.styles && !step.styles ) {
				step.styles = tutorial.styles;
			}

			if ( tutorial.setup && !step.setup ) {
				step.setup = tutorial.setup;
			}

			if ( tutorial.cleanup && !step.cleanup ) {
				step.cleanup = tutorial.cleanup;
			}

			dirname = path.join( outputdir, slugify( tutorial.title ), '' + ( stepIndex + 1 ) );
			htmlFilename = path.join( dirname, 'index.html' );
			jsonFilename = path.join( dirname, 'index.json' );
			content = generateTutorial( tutorial, step );

			return mkdirp( dirname ).then( function () {
				return Promise.all([
					writeFile( htmlFilename, content ),
					writeFile( jsonFilename, JSON.stringify( step ) )
				]);
			});

			function generateTutorial () {
				var manifest = tutorialData.map( function ( tutorial ) {
					return {
						title: tutorial.title,
						numSteps: tutorial.steps.length
					};
				});

				return new Tutorial({
					manifest: manifest,
					tutorialData: tutorialData,
					tutorialIndex: tutorialIndex,
					stepIndex: stepIndex,
					step: step
				})
					.toHTML()
					.replace( '<@manifest@>', JSON.stringify( manifest ) )
					.replace( '<@step@>', JSON.stringify( step ) );
			}
		});

		return Promise.all( promises );
	});

	return Promise.all( promises );
}

function redirectPromise ( inputdir, outputdir, tutorialData ) {
	var promises = tutorialData.map( function ( tutorial ) {
		var dirname, filename, content;

		dirname = path.join( outputdir, slugify( tutorial.title ) );
		filename = path.join( dirname, 'index.html' );
		content = redirectContent( '1' );

		return mkdirp( dirname ).then( function () {
			writeFile( filename, content );
		});
	});

	promises.push(
		// `/index.html` should redirect to the first tutorial
		writeFile( path.join( outputdir, 'index.html' ), redirectContent( slugify( tutorialData[0].title ) + '/1' ) )
	);

	return Promise.all( promises );

	function redirectContent ( destination ) {
		return '<script>window.location.href = \'' + destination + '\';</script>';
	}
}

function slugify ( str ) {
	if ( !str ) {
		return '';
	}
	return str.toLowerCase().replace( /[^a-z]/g, '-' ).replace( /-{2,}/g, '-' ).replace( /^-/, '' ).replace( /-$/, '' );
}
